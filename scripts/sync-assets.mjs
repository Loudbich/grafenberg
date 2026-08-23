#!/usr/bin/env node
/**
 * GRAFENBERG — ENCODAGE DES VISUELS DE MARQUE
 * -----------------------------------------------------------------------------
 * Encode ce que contient `assets/` vers `public/brand/`, à la taille que la mise
 * en page utilise réellement.
 *
 *   npm run assets
 *
 * SÉPARATION DES DEUX DOSSIERS :
 *   · `assets/`       l'archive. Les exports d'origine, en pleine résolution,
 *                     jamais servis ni inclus dans le bundle.
 *   · `public/brand/` ce que le site livre : du WebP à la largeur utile.
 *
 * Le logo arrive en PNG de 531 ko pour 1733 px de large ; la barre de navigation
 * le dessine à 141. Le portrait faisait 172 ko en PNG pour une colonne de 320.
 * Servir les sources reviendrait à faire télécharger trois quarts de méga-octet
 * pour deux éléments d'interface — davantage, à eux seuls, que les quatorze
 * pochettes de la page d'accueil réunies.
 *
 * Réencoder n'abîme pas les originaux : `assets/` n'est jamais modifié.
 *
 * POUR AJOUTER UN VISUEL : déposer le fichier dans son dossier sous `assets/`
 * et ajouter une entrée à `targets` ci-dessous.
 * -----------------------------------------------------------------------------
 */

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const OUT_DIR = resolve(root, 'public/brand');

const log = (...a) => console.log('[assets]', ...a);
const warn = (...a) => console.warn('[assets] ⚠ ', ...a);
const kb = (n) => `${Math.round(n / 1024)} ko`;

/**
 * Ce qui est encodé, et à quelle taille.
 *
 * Le nom de sortie est fixe et non dérivé du fichier source : celui-ci porte des
 * mentions d'outillage (« _transparent_optimized ») qui changeraient à chaque
 * ré-export et casseraient la référence côté React.
 *
 * Les largeurs viennent de ce que la mise en page dessine, pas de la source :
 * un fichier plus large ne serait que des pixels que personne ne distingue.
 */
const targets = [
  {
    dir: 'assets/logo',
    name: 'logo',
    // Dessiné à 141 px de large au plus (`md:h-12`). 320 couvre un écran en 2x,
    // 480 un écran à 3x.
    widths: [320, 480],
    // 92 plutôt que les 88 des pochettes : un tracé aux bords francs sur fond
    // transparent laisse voir la compression bien plus vite qu'une photographie.
    quality: 92,
    // La transparence du logo est ce qui le pose sur le fond sombre. La dégrader
    // dessine un halo autour des lettres, visible sur ces bords francs.
    alphaQuality: 100,
  },
  {
    dir: 'assets/portrait',
    name: 'portrait',
    // Une colonne de 320 px au plus ; 640 la couvre en 2x. Photographie, donc
    // la qualité peut descendre sans que cela se voie.
    widths: [640],
    quality: 84,
  },
];

async function encode({ dir, name, widths, quality, alphaQuality }) {
  const srcDir = resolve(root, dir);
  if (!existsSync(srcDir)) {
    warn(`${dir} est absent — ignoré.`);
    return { before: 0, after: 0 };
  }

  const sources = readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (!sources.length) {
    warn(`aucune image dans ${dir}.`);
    return { before: 0, after: 0 };
  }
  if (sources.length > 1) {
    // Sans cela, deux exports laissés côte à côte s'écraseraient l'un l'autre
    // dans un ordre qui dépend du système de fichiers.
    warn(`${dir} contient ${sources.length} images ; seule « ${sources[0]} » est encodée.`);
  }

  const source = join(srcDir, sources[0]);
  const meta = await sharp(source).metadata();
  let after = 0;

  for (const width of widths) {
    const widest = width === widths[widths.length - 1];
    const out = widest ? `${name}.webp` : `${name}-${width}.webp`;

    const info = await sharp(source)
      // `withoutEnlargement` : un export déjà petit reste petit plutôt que
      // d'être agrandi en flou.
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, ...(alphaQuality && { alphaQuality }), effort: 6 })
      .toFile(join(OUT_DIR, out));

    after += info.size;
    log(`${out} — ${info.width}×${info.height}, ${kb(info.size)}`);
  }

  const before = statSync(source).size;
  log(`   source : ${sources[0]} (${meta.width}×${meta.height}, ${kb(before)})`);
  return { before, after };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let before = 0;
  let after = 0;
  for (const target of targets) {
    const r = await encode(target);
    before += r.before;
    after += r.after;
  }

  log(`${kb(before)} d'archive → ${kb(after)} servis.`);
}

main().catch((err) => {
  warn(err.stack || err.message);
  process.exit(1);
});
