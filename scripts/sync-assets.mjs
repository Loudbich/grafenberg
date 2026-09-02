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

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const OUT_DIR = resolve(root, 'public/brand');
const OUT_ROSTER = resolve(root, 'public/roster');
const OUT_UNIVERSE = resolve(root, 'public/universe');

/**
 * Les dimensions réellement produites, écrites pour que le balisage les lise.
 *
 * Un `width`/`height` recopié à la main dans un composant dérive dès que la
 * source change de cadrage : le portrait est passé de 4:3 à 4:5 et la page
 * s'est remise à sauter au chargement, exactement comme la première fois.
 * Ce qui est mesuré à l'encodage n'a pas à être redit ailleurs.
 */
const MANIFEST = resolve(root, 'src/data/assets.generated.json');

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
    // Nommé explicitement : l'ancien lettrage rose plat cohabite avec le
    // nouveau dans le dossier, et le choix ne doit pas dépendre de l'ordre de
    // lecture du système de fichiers.
    file: 'Grafenberg_logo_liquid_glass.png',
    name: 'logo',
    // Dessiné jusqu'à 192 px de large (`md:h-16` sur un lettrage en 3:1).
    // 384 couvre un écran en 2x, 640 un écran à 3x.
    widths: [384, 640],
    // 92 plutôt que les 88 des pochettes : un tracé aux bords francs sur fond
    // transparent laisse voir la compression bien plus vite qu'une photographie.
    quality: 92,
    // La transparence du logo est ce qui le pose sur le fond sombre. La dégrader
    // dessine un halo autour des lettres, visible sur ces bords francs.
    alphaQuality: 100,
  },
  {
    dir: 'assets/artworks',
    // Nommé explicitement : le dossier contient aussi le rendu brut de
    // l'agrandisseur, un PNG de 11,7 Mo qui n'a rien à faire en ligne.
    file: 'Artwork_Grafenberg.webp',
    name: 'key-visual',
    // Bandeau pleine largeur en 2,39:1. 2560 couvre un écran 1440 sans excès ;
    // au-delà, on paierait des pixels que la compression rend indistincts.
    widths: [1280, 1920, 2560],
    quality: 80,
  },
  {
    dir: 'assets/artworks/mobile',
    file: 'Artwork_Grafenberg.webp',
    name: 'key-visual-mobile',
    // Version portrait 9:16, pour les écrans où le cadrage large ne laisserait
    // qu'une bande de 60 px de haut.
    widths: [720, 1080],
    quality: 80,
  },
  {
    dir: 'assets/portrait',
    file: 'Portrait_Grafenberg_2026.webp',
    name: 'portrait',
    // Une colonne de 320 px au plus ; 640 la couvre en 2x. Photographie, donc
    // la qualité peut descendre sans que cela se voie.
    widths: [640],
    quality: 84,
    // Le nouveau portrait est un cinémascope 3840×1608 : posé tel quel dans la
    // colonne de la section artiste, il n'y ferait qu'un bandeau de 130 px de
    // haut. Le sujet étant centré, un recadrage 4:5 le rend à sa fonction de
    // portrait sans rien perdre du halo qui l'encadre.
    crop: { ratio: 4 / 5 },
  },
];

/**
 * Le roster du label : onze artistes, chacun en cinémascope et en portrait.
 *
 * Traité à part des `targets` parce que la règle « une image par dossier » ne
 * s'y applique pas : il y a onze paires, nommées d'après le slug de l'artiste.
 * Le rattachement se fait sur ce slug, ce qui permet de renommer les fichiers
 * sources sans rien casser tant que le slug survit.
 */
const ROSTER_DIR = 'assets/roster kinetic distro';

/** Deux jeux : bandeau large sur écran large, portrait sur téléphone. */
const ROSTER_WIDE = { widths: [640, 1280], quality: 78, suffix: '' };
const ROSTER_TALL = { widths: [480, 720], quality: 78, suffix: 'tall' };

/**
 * Les bandeaux de la section « The wider universe » de la page d'accueil.
 *
 * Un seul cadrage, contrairement au roster : ces bandeaux surmontent une carte
 * dont la largeur varie peu — environ 546 px sur écran large, 343 sur
 * téléphone. 640 couvre le second en 2x, 1280 le premier.
 *
 * Le nom est PEINT DANS L'IMAGE, chacun dans sa propre typographie. Le site
 * n'en superpose donc aucun : ce serait l'écrire deux fois. C'est aussi
 * pourquoi ces fichiers ne reçoivent ni voile ni dégradé — les luminosités
 * vont du blanc crème de Nyla Vey au noir de Kinetic Distro, et un même voile
 * ne peut pas servir les deux.
 */
const UNIVERSE_DIR = 'assets/the wider universe';
const UNIVERSE = { widths: [640, 1280], quality: 80 };

const dimensions = {};

async function encode({ dir, file: fichier, name, widths, quality, alphaQuality, crop }) {
  const srcDir = resolve(root, dir);
  if (!existsSync(srcDir)) {
    warn(`${dir} est absent — ignoré.`);
    return { before: 0, after: 0 };
  }

  const sources = fichier
    ? [fichier]
    : readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
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

  // Le recadrage précède le redimensionnement : recadrer après reviendrait à
  // jeter des pixels qu'on vient de calculer.
  const decoupe = crop
    ? (() => {
        const largeur = Math.round(Math.min(meta.width, meta.height * crop.ratio));
        const hauteur = Math.round(Math.min(meta.height, largeur / crop.ratio));
        return {
          left: Math.round((meta.width - largeur) / 2),
          top: Math.round((meta.height - hauteur) / 2),
          width: largeur,
          height: hauteur,
        };
      })()
    : null;

  for (const width of widths) {
    const widest = width === widths[widths.length - 1];
    const out = widest ? `${name}.webp` : `${name}-${width}.webp`;

    const base = sharp(source);
    if (decoupe) base.extract(decoupe);

    const info = await base
      // `withoutEnlargement` : un export déjà petit reste petit plutôt que
      // d'être agrandi en flou.
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, ...(alphaQuality && { alphaQuality }), effort: 6 })
      .toFile(join(OUT_DIR, out));

    after += info.size;
    // Seule la plus large est retenue : c'est elle que `src` désigne, et le
    // rapport d'aspect est le même pour toutes.
    if (widest) dimensions[name] = { w: info.width, h: info.height };
    log(`${out} — ${info.width}×${info.height}, ${kb(info.size)}`);
  }

  const before = statSync(source).size;
  log(`   source : ${sources[0]} (${meta.width}×${meta.height}, ${kb(before)})`);
  return { before, after };
}

/**
 * Encode les visuels du roster.
 *
 * Les fichiers sources portent des noms lisibles et de casse variable —
 * « NOSFERA DISCO CLUB.webp », « Anatolian Mirage.webp » — que l'on rattache au
 * slug de l'artiste. Ceux du dossier `mobile/` le portent déjà.
 *
 * Chaque fichier est OUVERT avant d'être encodé, et pas seulement listé : le
 * dossier contenait un `Iron Covenant.webp` de 45 Mo qui était en réalité un
 * fichier audio WAV renommé. Sans cette vérification, le script aurait échoué
 * au milieu du lot en laissant les visuels précédents à moitié remplacés.
 */
async function encodeRoster(roster) {
  const dir = resolve(root, ROSTER_DIR);
  if (!existsSync(dir)) {
    warn(`${ROSTER_DIR} est absent — roster ignoré.`);
    return { before: 0, after: 0 };
  }

  const slugify = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  // Indexe ce qui est présent, par slug, pour chacun des deux cadrages.
  const trouve = { wide: new Map(), tall: new Map() };
  for (const [sous, cle] of [['', 'wide'], ['mobile', 'tall']]) {
    const d = sous ? join(dir, sous) : dir;
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d, { withFileTypes: true })) {
      if (!f.isFile() || !/\.(webp|png|jpe?g)$/i.test(f.name)) continue;
      const slug = slugify(f.name.replace(/\.[^.]+$/, '').replace(/-mobile$/i, ''));
      const chemin = join(d, f.name);
      // Une source déjà retenue n'est pas remplacée : `VEIN MIRROR.png` et
      // `VEIN MIRROR.webp` coexistent, et le premier lu suffit.
      if (!trouve[cle].has(slug)) trouve[cle].set(slug, chemin);
    }
  }

  let before = 0;
  let after = 0;

  for (const artiste of roster) {
    for (const [cle, preset] of [['wide', ROSTER_WIDE], ['tall', ROSTER_TALL]]) {
      let source = trouve[cle].get(artiste.slug);

      /**
       * Le cadrage portrait, dérivé du large quand il manque.
       *
       * La grille est faite de cartes portrait sur téléphone : sans ce
       * fichier, l'artiste en est absent. Plutôt que de l'exclure, on taille
       * le portrait dans le bandeau large.
       *
       * `entropy` et non `centre` ni `attention` : les trois ont été
       * comparées sur le bandeau de Nyla Vey, dont le nom occupe la gauche et
       * le visage la droite. Le centre coupait le nom en deux, `attention`
       * tombait sur le ciel vide, `entropy` a cadré le visage proprement.
       *
       * Le nom peint est perdu au recadrage — sans conséquence ici : la carte
       * du roster écrit déjà le nom par-dessus, contrairement à celles de
       * « The wider universe ». Un portrait fait à la main reste préférable ;
       * ceci évite seulement qu'un artiste disparaisse en attendant.
       */
      let derive = false;
      if (!source && cle === 'tall') {
        source = trouve.wide.get(artiste.slug);
        derive = Boolean(source);
      }

      if (!source) {
        warn(`${artiste.name} : pas de visuel « ${cle} ».`);
        continue;
      }
      if (derive) {
        warn(`${artiste.name} : portrait dérivé du bandeau large (recadrage entropique).`);
      }

      let meta;
      try {
        meta = await sharp(source).metadata();
        if (!meta.width) throw new Error('dimensions illisibles');
      } catch (err) {
        warn(`${artiste.name} (${cle}) : fichier illisible — ${err.message}. Ignoré.`);
        continue;
      }

      before += statSync(source).size;
      const base = artiste.slug + (preset.suffix ? `-${preset.suffix}` : '');

      for (const width of preset.widths) {
        const widest = width === preset.widths[preset.widths.length - 1];
        const out = widest ? `${base}.webp` : `${base}-${width}.webp`;
        // Un portrait dérivé est recadré au rapport 9:16 de la carte ; un
        // fichier fourni est simplement redimensionné, son cadrage étant déjà
        // celui qu'on veut.
        const pipeline = derive
          ? sharp(source).resize(width, Math.round((width * 16) / 9), {
              fit: 'cover',
              position: 'entropy',
            })
          : sharp(source).resize({ width, withoutEnlargement: true });

        const info = await pipeline
          .webp({ quality: preset.quality, effort: 5 })
          .toFile(join(OUT_ROSTER, out));
        after += info.size;
        // Inscrit au manifeste : c'est ce qui permet à la page de savoir quels
        // artistes ont leurs bandeaux, au lieu de porter des exceptions écrites
        // à la main pour ceux qui n'en ont pas.
        if (widest) {
          const cle = `roster-${artiste.slug}${preset.suffix ? `-${preset.suffix}` : ''}`;
          dimensions[cle] = { w: info.width, h: info.height };
        }
      }
    }
  }

  log(`${roster.length} artistes encodés → public/roster/`);
  return { before, after };
}

/**
 * Encode les bandeaux de « The wider universe ».
 *
 * Rattachement par slug, comme le roster : « broken shaman.webp » et
 * « kinetic distro.webp » deviennent `broken-shaman` et `kinetic-distro`.
 * Renommer un fichier source ne casse rien tant que le slug survit.
 */
async function encodeUniverse(sujets) {
  const dir = resolve(root, UNIVERSE_DIR);
  if (!existsSync(dir)) {
    warn(`${UNIVERSE_DIR} est absent — bandeaux ignorés.`);
    return { before: 0, after: 0 };
  }

  const slugify = (v) =>
    v
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const trouve = new Map();
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (!f.isFile() || !/\.(webp|png|jpe?g)$/i.test(f.name)) continue;
    trouve.set(slugify(f.name.replace(/\.[^.]+$/, '')), join(dir, f.name));
  }

  let before = 0;
  let after = 0;

  for (const slug of sujets) {
    const source = trouve.get(slug);
    if (!source) {
      warn(`« ${slug} » : pas de bandeau dans ${UNIVERSE_DIR}.`);
      continue;
    }

    // Ouvert avant d'être encodé : c'est ce qui avait permis d'attraper un
    // fichier audio renommé en .webp dans le dossier du roster.
    let meta;
    try {
      meta = await sharp(source).metadata();
      if (!meta.width) throw new Error('dimensions illisibles');
    } catch (err) {
      warn(`« ${slug} » : fichier illisible — ${err.message}. Ignoré.`);
      continue;
    }

    before += statSync(source).size;

    for (const width of UNIVERSE.widths) {
      const widest = width === UNIVERSE.widths[UNIVERSE.widths.length - 1];
      const out = widest ? `${slug}.webp` : `${slug}-${width}.webp`;
      const info = await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: UNIVERSE.quality, effort: 5 })
        .toFile(join(OUT_UNIVERSE, out));
      after += info.size;
      if (widest) dimensions[`universe-${slug}`] = { w: info.width, h: info.height };
    }
  }

  log(`${sujets.length} bandeaux « wider universe » → public/universe/`);
  return { before, after };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(OUT_ROSTER, { recursive: true });
  mkdirSync(OUT_UNIVERSE, { recursive: true });

  let before = 0;
  let after = 0;
  for (const target of targets) {
    const r = await encode(target);
    before += r.before;
    after += r.after;
  }

  // `otherArtists` et non `roster` : la page ne montre pas Grafenberg, et
  // encoder son visuel produirait des fichiers déployés que rien ne demande.
  const { otherArtists } = await import('../src/data/roster.ts');
  const r = await encodeRoster(otherArtists);
  before += r.before;
  after += r.after;

  const { facets } = await import('../src/data/facets.ts');
  const u = await encodeUniverse(facets.map((f) => f.slug));
  before += u.before;
  after += u.after;

  writeFileSync(MANIFEST, JSON.stringify(dimensions, null, 2) + '\n');

  log(`${kb(before)} d'archive → ${kb(after)} servis.`);
}

main().catch((err) => {
  warn(err.stack || err.message);
  process.exit(1);
});
