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

import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const CATALOG = resolve(root, 'src/data/catalog.generated.json');
const OUT_DIR = resolve(root, 'public/covers');

const FORCE = process.argv.slice(2).includes('--force');

/**
 * Deux largeurs, parce que les deux usages sont loin l'un de l'autre.
 *
 * La grille d'accueil dessine quatorze pochettes à ~380px ; la page d'album en
 * dessine une à ~500. Servir le fichier de la page d'album dans la grille
 * faisait télécharger 2,6 Mo pour afficher l'équivalent de 500 ko. Le `srcset`
 * laisse le navigateur choisir, et un écran HiDPI sur la page d'album reçoit
 * toujours le 1000.
 */
const WIDTHS = [400, 1000];
const QUALITY = 88;

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

  let fetched = 0;
  let skipped = 0;
  let failed = 0;
  let bytes = 0;

  for (const [slug, entry] of Object.entries(releases ?? {})) {
    // La plus large porte le nom nu : c'est elle que `src` désigne, donc celle
    // que reçoit un navigateur qui ignore srcset.
    const dest = join(OUT_DIR, `${slug}.webp`);

    if (!entry.artwork) {
      warn(`${slug} : pas de pochette sur SoundCloud.`);
      failed++;
      continue;
    }

    if (existsSync(dest) && !FORCE) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(entry.artwork);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const source = Buffer.from(await res.arrayBuffer());

      const sizes = [];
      for (const width of WIDTHS) {
        const widest = width === WIDTHS[WIDTHS.length - 1];
        const file = widest ? `${slug}.webp` : `${slug}-${width}.webp`;
        // `withoutEnlargement` : si SoundCloud n'a qu'un 500px, on garde 500px.
        // Un agrandissement ne rendrait pas la pochette plus nette, seulement
        // plus lourde.
        const info = await sharp(source)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(join(OUT_DIR, file));

        bytes += info.size;
        sizes.push(`${info.width}px ${kb(info.size)}`);
      }

      fetched++;
      log(`${slug} — ${sizes.join(', ')}`);
    } catch (err) {
      // Une pochette manquante ne doit pas coûter les treize autres.
      warn(`${slug} : ${err.message}`);
      failed++;
    }
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
