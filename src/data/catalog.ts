/**
 * CATALOGUE — fusion du manifeste et du sync
 * -----------------------------------------------------------------------------
 * `releases.ts` dit ce qui est publié ; `catalog.generated.json` dit ce que
 * SoundCloud en sait. Ce module les assemble en un seul objet typé, qui est la
 * seule forme que les composants consomment.
 *
 * Règle de fusion : le manifeste gagne toujours. Le JSON généré ne fait que
 * combler les champs que le manifeste laisse vides. Une valeur écrite à la main
 * n'est jamais écrasée par un sync — c'est ce qui permet de corriger une date
 * fausse ou un titre mal orthographié sans que le sync suivant le défasse.
 *
 * Le site reste fonctionnel si le sync n'a jamais tourné : sans JSON, chaque
 * sortie garde son titre, ses liens et son accent, et perd seulement sa
 * pochette et sa tracklist.
 * -----------------------------------------------------------------------------
 */

import generated from './catalog.generated.json';
import coverManifest from './covers.generated.json';
import {
  releases as curatedAlbums,
  secondaryReleases as curatedSecondary,
  type CuratedRelease,
  type ReleaseKind,
  type Accent,
} from './releases';

export type { ReleaseKind, Accent };
export { links } from './releases';

/** Ce qu'un composant reçoit : le manifeste, complété. */
export type Release = CuratedRelease & {
  /** Absente tant que le sync n'a pas tourné pour cette sortie. */
  artwork?: string;
  /** Pochette locale servie par le site, si elle a été récupérée. */
  cover?: string;
  /** Les deux largeurs de la pochette locale, pour l'attribut srcset. */
  coverSrcSet?: string;
  /** La petite variante seule, pour les vignettes de quelques dizaines de px. */
  coverSmall?: string;
  /**
   * La pochette en version fond de bandeau : plus grande et plus compressée.
   *
   * Le bandeau d'accueil étire la pochette sur toute la largeur de l'écran, ce
   * qui en fait l'usage le plus exigeant en dimensions du site — et le plus
   * indulgent en qualité, puisqu'une vignette, un dégradé et des scanlines
   * passent par-dessus. Ces fichiers sont donc encodés à part, en 800, 1280 et
   * 1920 px à qualité réduite.
   */
  background?: string;
  backgroundSrcSet?: string;
  trackCount?: number;
  tracklist: string[];
  /** Texte de présentation SoundCloud, tel quel. Peut être vide. */
  description?: string;
  /** Permalien du set, pour la façade de lecture et le lien sortant. */
  soundcloudUrl?: string;
  /** Date d'affichage, déjà arbitrée entre manifeste et sync. */
  date?: string;
};

type GeneratedEntry = {
  soundcloudId: string;
  soundcloudUrl: string;
  date: string | null;
  dateFromSoundCloud: string | null;
  artwork: string;
  trackCount: number | null;
  description: string;
  tracklist: string[];
};

const synced = (generated as { releases?: Record<string, GeneratedEntry> }).releases ?? {};

/**
 * Les pochettes vivent dans `public/covers/`, écrites par `npm run covers`.
 *
 * Référencées par URL et non importées : `public/` est copié verbatim par Vite,
 * et un `import.meta.glob` dessus produirait un second exemplaire de chaque
 * fichier dans `assets/`, haché — les mêmes mégaoctets livrés deux fois.
 *
 * Les largeurs viennent du manifeste que `sync-covers` écrit, et non de
 * constantes recopiées ici. La différence n'est pas cosmétique : la largeur
 * demandée n'est pas toujours celle obtenue, puisque l'encodage n'agrandit
 * jamais une source trop petite. Une pochette limitée aux 1080 px de SoundCloud
 * produit un fichier de 1080 là où l'on demandait 1280 ; annoncer « 1280w »
 * conduirait le navigateur à le choisir en le croyant plus défini qu'il n'est,
 * et à écarter un fichier plus adapté.
 */
type CoverVariant = { file: string; w: number };
type CoverEntry = { content?: CoverVariant[]; bg?: CoverVariant[] };

const covers = coverManifest as Record<string, CoverEntry>;

/** `a.webp 400w, b.webp 1000w` — vide s'il n'y a qu'une seule largeur. */
const srcSetOf = (variants: CoverVariant[] = []) =>
  variants.length > 1 ? variants.map((v) => `/covers/${v.file} ${v.w}w`).join(', ') : undefined;

/** Le fichier le plus large d'un jeu : celui que `src` doit désigner. */
const widestOf = (variants: CoverVariant[] = []) =>
  variants.length ? `/covers/${variants[variants.length - 1].file}` : undefined;

function coverFor(slug: string) {
  const entry = covers[slug];
  if (!entry) return {};

  return {
    cover: widestOf(entry.content),
    coverSrcSet: srcSetOf(entry.content),
    // La plus petite variante, pour les vignettes de quelques dizaines de px
    // — l'étiquette au centre du disque vinyle, notamment.
    coverSmall: entry.content?.[0] ? `/covers/${entry.content[0].file}` : undefined,
    background: widestOf(entry.bg),
    backgroundSrcSet: srcSetOf(entry.bg),
  };
}

function merge(entry: CuratedRelease): Release {
  const from = synced[entry.slug];

  return {
    ...entry,
    // `??` et non `||` : une date curée vide serait une erreur à corriger, pas
    // un signal de repli. Seul `undefined` déclenche la valeur du sync.
    date: entry.date ?? from?.date ?? undefined,
    artwork: from?.artwork,
    ...coverFor(entry.slug),
    trackCount: from?.trackCount ?? undefined,
    tracklist: from?.tracklist ?? [],
    description: from?.description || undefined,
    soundcloudUrl:
      from?.soundcloudUrl ??
      (entry.soundcloud ? `https://soundcloud.com/grafenbergmusik/sets/${entry.soundcloud}` : undefined),
  };
}

/** Les dix albums — huit en solo, deux en collaboration. */
export const albums: Release[] = curatedAlbums.map(merge);

/** EPs, relectures et singles. */
export const secondary: Release[] = curatedSecondary.map(merge);

export const catalogue: Release[] = [...albums, ...secondary];

export const getRelease = (slug: string): Release | undefined =>
  catalogue.find((r) => r.slug === slug);

/** Les sorties disponibles en vinyle. Une seule à ce jour. */
export const onVinyl: Release[] = catalogue.filter((r) => r.vinyl);

/** La sortie la plus récente : ce que la page d'accueil met en avant. */
export const latest: Release = albums[0];

/** Quand le catalogue a été rafraîchi. Affiché nulle part, utile au débogage. */
export const generatedAt: string | undefined = (generated as { generatedAt?: string }).generatedAt;

/** Libellés affichés dans les pastilles. Le site est en anglais. */
export const kindLabels: Record<ReleaseKind, string> = {
  album: 'Album',
  collab: 'Collaboration',
  ep: 'EP',
  remixes: 'Remixes',
  single: 'Single',
};

/**
 * Année d'une sortie, ou chaîne vide.
 *
 * Découpe la chaîne ISO plutôt que de construire une Date : `new Date()` sur
 * une date nue la lit en UTC puis l'affiche en heure locale, ce qui décale au
 * 31 décembre tout album sorti un 1er janvier à l'ouest de Greenwich.
 */
export const yearOf = (release: Release): string => release.date?.slice(0, 4) ?? '';

/**
 * La première phrase utile de la présentation d'un disque.
 *
 * Les textes SoundCloud ne commencent pas tous par leur accroche : plusieurs
 * s'ouvrent sur le titre en capitales, parfois suivi de la mention du label.
 * Prendre la première ligne telle quelle affichait « GRAFENBERG - PARALLEL SIN
 * THEORY » en guise de description, dans le bandeau d'accueil comme dans les
 * résultats de recherche.
 *
 * Une ligne est écartée si elle ne fait que répéter ce que la page affiche
 * déjà — le titre, le nom, l'éditeur. Le repli décrit le disque à défaut de le
 * présenter, ce qui vaut mieux qu'une ligne vide.
 */
export function taglineOf(release: Release): string {
  // Sans accents ni ponctuation : « Erebion's Dominion » et « EREBIONS
  // DOMINION » doivent se reconnaître l'un l'autre.
  const normalise = (v: string) =>
    v
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const title = normalise(release.title);
  const artist = normalise(release.artist);

  const isBoilerplate = (line: string) => {
    const n = normalise(line);
    if (!n) return true;
    // Le titre seul, le nom seul, ou les deux accolés dans un sens ou l'autre.
    if (n === title || n === artist) return true;
    if (n === `${artist} ${title}` || n === `${title} ${artist}`) return true;
    if (n.startsWith('released by') || n.startsWith('out now')) return true;
    return false;
  };

  const line = (release.description ?? '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !isBoilerplate(l));

  return line ?? `${kindLabels[release.kind]} by ${release.artist}`;
}

/**
 * Date longue : « 3 September 2025 ».
 *
 * `en-GB` et non `en-US` : l'ordre jour-mois-année lève l'ambiguïté du 04/05 et
 * correspond à la locale que le site déclare.
 *
 * Le fuseau est forcé à UTC — sans cela, `new Date()` lit une date nue en UTC
 * puis l'affiche en heure locale, ce qui recule d'un jour tout disque sorti un
 * 1er du mois pour un visiteur situé à l'ouest de Greenwich.
 */
export function formatDate(release: Release): string {
  if (!release.date) return '';
  const [y, m, d] = release.date.split('-').map(Number);

  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
