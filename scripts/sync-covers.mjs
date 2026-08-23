#!/usr/bin/env node
/**
 * GRAFENBERG — RAPATRIEMENT DES POCHETTES
 * -----------------------------------------------------------------------------
 * Télécharge la pochette de chaque sortie depuis SoundCloud et la ré-encode en
 * WebP dans `public/covers/<slug>.webp`.
 *
 *   npm run covers          récupère ce qui manque
 *   npm run covers -- --force  ré-encode tout, même l'existant
 *
 * POURQUOI NE PAS POINTER DIRECTEMENT SUR i1.sndcdn.com : le lecteur du site
 * est une façade — rien ne contacte SoundCloud tant que personne n'a appuyé sur
 * lecture. Servir les pochettes depuis leur CDN annulerait exactement cette
 * garantie : la grille de la page d'accueil enverrait l'adresse IP de chaque
 * visiteur à SoundCloud avant même qu'il ait fait un geste. Les pochettes sont
 * donc hébergées ici, avec les polices, pour la même raison.
 *
 * Accessoirement : les JPEG servis par SoundCloud font 200 à 400 ko en 1080px
 * là où le WebP équivalent en fait 60 à 90.
 *
 * SÛRETÉ : un téléchargement raté laisse la pochette précédente en place et
 * n'interrompt pas les suivants.
 * -----------------------------------------------------------------------------
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const CATALOG = resolve(root, 'src/data/catalog.generated.json');
const OUT_DIR = resolve(root, 'public/covers');
const MANIFEST = resolve(root, 'src/data/covers.generated.json');

const FORCE = process.argv.slice(2).includes('--force');

/**
 * Deux jeux de fichiers, parce que les deux usages n'ont ni la même taille ni
 * les mêmes exigences.
 *
 * CONTENU — la pochette qu'on regarde : dans la grille (~380 px) et sur la page
 * d'album (~500). Elle doit être fidèle, d'où une qualité élevée.
 *
 * FOND — le bandeau d'accueil, où la pochette couvre tout l'écran sous une
 * vignette, un dégradé et des scanlines. C'est le cas le plus exigeant en
 * dimensions et le plus indulgent en qualité : une image carrée en
 * `object-cover` sur un écran de 1920 px doit couvrir 1920 px de large.
 *
 * J'avais servi le fichier de 400 px à cet endroit en croyant qu'aucun détail
 * n'y ressortait. C'était faux : agrandi près de cinq fois, il rendait une
 * bouillie visible. Mesuré côte à côte, 1280 px en qualité 68 est à la fois
 * plus net et plus léger que les 1000 px en qualité 88 d'avant.
 *
 * Le fond s'arrête à 1280. Un palier de 1920 a été essayé puis retiré : sur les
 * pochettes les plus denses du catalogue il atteignait 740 ko, pour gagner de
 * la netteté sur les seuls écrans très larges. À 1280, un écran de 1920 px
 * applique un agrandissement de 1,5× — souple, sans aucun des blocs que
 * produisait le fichier de 400 px.
 */
const CONTENT = { widths: [400, 1000], quality: 88, suffix: '' };
const BACKGROUND = { widths: [800, 1280], quality: 70, suffix: 'bg' };

const log = (...a) => console.log('[covers]', ...a);
const warn = (...a) => console.warn('[covers] ⚠ ', ...a);
const kb = (n) => `${Math.round(n / 1024)} ko`;

async function main() {
  if (!existsSync(CATALOG)) {
    warn("aucun catalogue généré — lancez d'abord `npm run sync`.");
    process.exit(0);
  }

  const { releases } = JSON.parse(readFileSync(CATALOG, 'utf8'));
  mkdirSync(OUT_DIR, { recursive: true });

  /**
   * Ce qui a réellement été écrit, largeur par largeur.
   *
   * Nécessaire parce que la largeur demandée n'est pas toujours celle obtenue :
   * `withoutEnlargement` s'arrête à la taille de la source, si bien qu'une
   * pochette limitée aux 1080 px de SoundCloud produit un fichier de 1080 là où
   * l'on demandait 1280. Écrire « 1280w » dans le srcset serait alors un
   * mensonge au navigateur, qui choisirait ce fichier en le croyant plus défini
   * qu'il ne l'est.
   */
  const manifest = {};

  let fetched = 0;
  let skipped = 0;
  let failed = 0;
  let bytes = 0;

  for (const [slug, entry] of Object.entries(releases ?? {})) {
    // La plus large porte le nom nu : c'est elle que `src` désigne, donc celle
    // que reçoit un navigateur qui ignore srcset.
    const dest = join(OUT_DIR, `${slug}.webp`);

    // Bandcamp sert l'original — 3000 px — là où SoundCloud plafonne à 1080.
    // Downsampler depuis 3000 donne un 1600 réellement net ; upsampler depuis
    // 1080 ne fait qu'inventer des pixels.
    const sourceUrl = entry.artworkHiRes ?? entry.artwork;

    if (!sourceUrl) {
      warn(`${slug} : aucune pochette disponible.`);
      failed++;
      continue;
    }

    if (existsSync(dest) && !FORCE) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(sourceUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const sourceBuffer = Buffer.from(await res.arrayBuffer());

      const sizes = [];
      for (const { widths, quality, suffix } of [CONTENT, BACKGROUND]) {
        for (const width of widths) {
          // Le plus large de chaque jeu porte le nom nu : c'est lui que `src`
          // désigne, donc celui que reçoit un navigateur sans srcset.
          const widest = width === widths[widths.length - 1];
          const stem = suffix ? `${slug}-${suffix}` : slug;
          const file = widest ? `${stem}.webp` : `${stem}-${width}.webp`;

          // `withoutEnlargement` : si la source est plus petite que la cible,
          // on garde sa taille. Un agrandissement n'invente pas de détail, il
          // ne produit que des octets.
          const info = await sharp(sourceBuffer)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 5 })
            .toFile(join(OUT_DIR, file));

          bytes += info.size;
          sizes.push(`${info.width}px ${kb(info.size)}`);

          const kind = suffix || 'content';
          (manifest[slug] ??= {})[kind] ??= [];
          // Les doublons apparaissent quand deux largeurs demandées dépassent
          // toutes deux la source et retombent sur la même taille réelle.
          if (!manifest[slug][kind].some((v) => v.w === info.width)) {
            manifest[slug][kind].push({ file, w: info.width });
          }
        }
      }

      fetched++;
      const origine = entry.artworkHiRes ? 'bandcamp' : 'soundcloud';
      log(`${slug} [${origine}] — ${sizes.join(', ')}`);
    } catch (err) {
      // Une pochette manquante ne doit pas coûter les treize autres.
      warn(`${slug} : ${err.message}`);
      failed++;
    }
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

  /**
   * Supprime les fichiers que ce script ne produit plus.
   *
   * Les largeurs émises changent au fil des réglages, et sans ce ménage les
   * anciennes restent en place : une série d'essais successifs avait laissé
   * assez de variantes orphelines pour porter le site déployé de 4 à 14 Mo —
   * des fichiers que plus aucun srcset ne référençait, mais que l'hébergeur
   * servait quand même.
   *
   * Ne s'exécute qu'après un passage complet et sans échec : élaguer alors
   * qu'une pochette vient de manquer supprimerait sa version précédente, encore
   * valide. Et seulement en `--force`, seul mode où toutes les entrées sont
   * réécrites — sinon les fichiers simplement « déjà présents » seraient pris
   * pour des orphelins.
   */
  if (FORCE && !failed) {
    const attendus = new Set(
      Object.values(manifest).flatMap((e) => Object.values(e).flat().map((v) => v.file)),
    );
    let elagues = 0;
    for (const file of readdirSync(OUT_DIR)) {
      if (file.endsWith('.webp') && !attendus.has(file)) {
        rmSync(join(OUT_DIR, file));
        elagues++;
      }
    }
    if (elagues) log(`${elagues} fichier(s) orphelin(s) supprimé(s).`);
  }

  const total = Object.keys(releases ?? {}).length;
  log(
    `${fetched} récupérée(s) (${kb(bytes)}), ${skipped} déjà présente(s), ` +
      `${failed} en échec — ${total} au catalogue.`,
  );
  if (skipped && !FORCE) log('`npm run covers -- --force` pour tout ré-encoder.');
}

main().catch((err) => {
  warn(err.stack || err.message);
  process.exit(0);
});
