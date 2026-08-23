#!/usr/bin/env node
/**
 * GRAFENBERG — SYNC SOUNDCLOUD
 * -----------------------------------------------------------------------------
 * Hydrate le manifeste `src/data/releases.ts` avec ce que SoundCloud sait déjà :
 * pochette, date, nombre de titres, tracklist, texte de présentation. Le
 * résultat est écrit dans `src/data/catalog.generated.json`, que le site lit au
 * build.
 *
 *   npm run sync           sync complet
 *   npm run sync -- --dry  interroge et rapporte, n'écrit rien
 *   npm run sync -- --strict  sort en erreur si une sortie n'a pas été trouvée
 *
 * SENS DE LA FUSION : le manifeste décide de CE QUI est publié, SoundCloud
 * fournit les DÉTAILS. Une sortie absente du manifeste n'apparaît jamais, même
 * si elle est sur le compte — celui-ci est celui du label et héberge onze
 * artistes.
 *
 * SÛRETÉ : ce script ne casse jamais un build. Toute erreur réseau ou de
 * parsing est signalée et le fichier généré précédent est conservé tel quel.
 * Le code de sortie reste 0 sauf avec --strict.
 *
 * REQUIERT Node >= 22.18 (import direct du manifeste TypeScript).
 * -----------------------------------------------------------------------------
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveClientId, fetchUserSets, mapSet, hydrateTracklists } from './lib/scapi.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const OUT = resolve(root, 'src/data/catalog.generated.json');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const STRICT = args.includes('--strict');

const UA =
  'Mozilla/5.0 (compatible; GrafenbergSiteBot/1.0; +https://www.grafenberg.ovh) build-time catalogue sync';

const log = (...a) => console.log('[sync]', ...a);
const warn = (...a) => console.warn('[sync] ⚠ ', ...a);

/* -------------------------------------------------------------------------- */

async function get(url, { timeoutMs = 20000, retries = 2 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA } });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      clearTimeout(timer);
      if (attempt === retries) throw err;
      // Un repli court : l'API renvoie des 429 passagers sur les gros comptes.
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

/**
 * L'URL de la pochette en pleine résolution sur Bandcamp.
 *
 * SoundCloud plafonne ses artworks à 1080 px, ce qui suffit pour une vignette
 * mais pas pour le fond du bandeau d'accueil : celui-ci couvre toute la largeur
 * de l'écran, si bien qu'un carré de 1080 y est agrandi près de deux fois et
 * que les détails fins s'y écrasent.
 *
 * Bandcamp sert l'original — 3000 px dans les cas observés. Les identifiants
 * d'image y ont la forme `a<chiffres>_<variante>` ; le suffixe `_0` est le
 * fichier tel qu'il a été téléversé.
 *
 * Échoue en douceur : sans Bandcamp, la pochette SoundCloud reste utilisable.
 */
async function bandcampArtwork(url) {
  try {
    const html = await get(url, { retries: 1 });
    const id = html.match(/f4\.bcbits\.com\/img\/(a\d+)_/)?.[1];
    return id ? `https://f4.bcbits.com/img/${id}_0.jpg` : null;
  } catch {
    return null;
  }
}

/** Le slug est le dernier segment du permalien : /sets/<slug>. */
const slugOf = (url) => (url || '').split('/sets/')[1]?.split(/[?#]/)[0] ?? null;

/**
 * Conserve le fichier précédent et sort proprement.
 *
 * Un sync raté ne doit pas vider le site : sans réseau, le catalogue déjà
 * généré reste la meilleure information disponible.
 */
function bail(reason) {
  warn(reason);
  if (existsSync(OUT)) {
    log('catalogue précédent conservé —', OUT);
  } else {
    warn("aucun catalogue précédent : le site retombera sur le manifeste seul.");
  }
  process.exit(STRICT ? 1 : 0);
}

/* -------------------------------------------------------------------------- */

async function main() {
  const { allReleases, SOUNDCLOUD_USER_ID } = await import('../src/data/releases.ts');

  const wanted = new Map();
  for (const r of allReleases) {
    if (r.soundcloud) wanted.set(r.soundcloud, r);
  }
  log(`${allReleases.length} sorties au manifeste, dont ${wanted.size} à hydrater.`);

  const clientId = await resolveClientId(get);
  if (!clientId) bail("client_id introuvable — SoundCloud a changé ses bundles.");
  log('client_id résolu.');

  let raw;
  try {
    raw = await fetchUserSets(get, { userId: SOUNDCLOUD_USER_ID, clientId });
  } catch (err) {
    bail(`récupération des sets impossible : ${err.message}`);
  }
  log(`${raw.length} sets lus sur le compte du label.`);

  // Indexé par slug : c'est la clé stable côté manifeste. Les titres, eux,
  // varient (« [FULL ALBUM] », casse, tirets) et ne peuvent pas servir de clé.
  const bySlug = new Map();
  for (const set of raw) {
    const slug = slugOf(set.permalink_url);
    if (slug) bySlug.set(slug, set);
  }

  const matched = [];
  const missing = [];
  for (const [slug, release] of wanted) {
    const found = bySlug.get(slug);
    if (found) matched.push([release, mapSet(found)]);
    else missing.push(`${release.title} (/sets/${slug})`);
  }

  if (missing.length) {
    warn(`${missing.length} sortie(s) introuvable(s) sur SoundCloud :`);
    missing.forEach((m) => warn('   ·', m));
  }

  await hydrateTracklists(
    get,
    matched.map(([, set]) => set),
    { clientId },
  );

  // Les pochettes haute résolution, cherchées en parallèle : une quinzaine de
  // pages Bandcamp en séquence coûterait une dizaine de secondes pour rien.
  const withBandcamp = allReleases.filter((r) => r.bandcamp);
  const hiRes = new Map();
  if (withBandcamp.length) {
    const found = await Promise.all(
      withBandcamp.map(async (r) => [r.slug, await bandcampArtwork(r.bandcamp)]),
    );
    for (const [slug, url] of found) if (url) hiRes.set(slug, url);
    log(`${hiRes.size}/${withBandcamp.length} pochettes haute résolution trouvées sur Bandcamp.`);
  }

  const catalogue = {};
  for (const [release, set] of matched) {
    catalogue[release.slug] = {
      soundcloudId: set.id,
      soundcloudUrl: set.url,
      // La date curée l'emporte : plusieurs albums ont été téléversés en lot et
      // portent leur date de dépôt, pas celle de leur sortie.
      date: release.date ?? set.date,
      dateFromSoundCloud: set.date,
      artwork: set.artwork,
      // La source préférée pour l'encodage : Bandcamp quand il l'a, SoundCloud
      // sinon. `artwork` est conservé tel quel comme repli.
      artworkHiRes: hiRes.get(release.slug) ?? null,
      trackCount: set.trackCount,
      description: set.description,
      tracklist: set.tracklist,
    };
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: `https://soundcloud.com/grafenbergmusik`,
    releaseCount: Object.keys(catalogue).length,
    missing,
    releases: catalogue,
  };

  const summary = `${payload.releaseCount}/${wanted.size} sorties hydratées`;

  if (DRY) {
    log(`[--dry] ${summary} — rien n'a été écrit.`);
    for (const [slug, r] of Object.entries(catalogue)) {
      const flag = r.date !== r.dateFromSoundCloud ? ' (date curée)' : '';
      log(`   · ${slug} — ${r.date}${flag} — ${r.tracklist.length}/${r.trackCount} titres`);
    }
  } else {
    writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
    log(`${summary} → src/data/catalog.generated.json`);
  }

  if (STRICT && missing.length) process.exit(1);
}

main().catch((err) => bail(err.stack || err.message));
