/**
 * GRAFENBERG — DISCOGRAPHIE CURÉE
 * -----------------------------------------------------------------------------
 * La liste de référence de ce que le site publie, dans l'ordre où il le publie.
 *
 * Ce fichier ne contient QUE ce qu'une machine ne peut pas deviner : le nom de
 * scène, la nature du disque, les liens marchands, l'accent chromatique de la
 * page. Tout ce que SoundCloud sait déjà — pochette, date, nombre de titres,
 * tracklist, texte de présentation — est récupéré au build par
 * `npm run sync` et fusionné dans `catalog.ts`.
 *
 * C'est délibérément un manifeste et non un miroir automatique du compte
 * SoundCloud : ce compte est celui du label Kinetic Distro, qui héberge onze
 * artistes. Un miroir ferait apparaître Anatolian Mirage sur le site de
 * Grafenberg. Ici, rien ne s'affiche qui n'ait été inscrit à la main.
 *
 * POUR AJOUTER UNE SORTIE : ajouter une entrée en tête de tableau avec son
 * `soundcloud` (le slug après /sets/), puis lancer `npm run sync`.
 * -----------------------------------------------------------------------------
 */

/** Ce que le disque est — décide de la section où il apparaît. */
export type ReleaseKind =
  | 'album' // album solo
  | 'collab' // album en collaboration
  | 'ep'
  | 'remixes' // relectures par d'autres artistes
  | 'single';

/** Les trois accents néon de la charte. Voir `--neon-*` dans index.css. */
export type Accent = 'orange' | 'cyan' | 'magenta' | 'violet';

export type CuratedRelease = {
  /** Segment d'URL : /album/<slug>. Ne jamais le changer une fois en ligne. */
  slug: string;
  /** Titre d'affichage, dans la casse voulue par l'artiste. */
  title: string;
  /** Crédité tel quel sur la page. Une collaboration porte les deux noms. */
  artist: string;
  kind: ReleaseKind;
  /** Slug du set SoundCloud (après /sets/). Absent = pas d'écoute en ligne. */
  soundcloud?: string;
  /** URL Bandcamp complète — les slugs diffèrent parfois de SoundCloud. */
  bandcamp?: string;
  /** Pressage vinyle, s'il existe. Affiche la section d'achat sur la page. */
  vinyl?: string;
  accent: Accent;
  /**
   * Date de sortie réelle, au format ISO.
   *
   * À ne renseigner que lorsque SoundCloud se trompe. Plusieurs albums du
   * back-catalogue ont été téléversés en lot le 18 avril 2026 ; l'API renvoie
   * cette date de dépôt, pas celle de la sortie. La date curée l'emporte
   * toujours sur celle du sync.
   */
  date?: string;
  /** Liens DSP. Seuls ceux renseignés sont affichés. */
  streaming?: {
    spotify?: string;
    appleMusic?: string;
    deezer?: string;
    amazonMusic?: string;
    qobuz?: string;
  };
};

/**
 * Du plus récent au plus ancien. C'est l'ordre d'affichage : il est tenu à la
 * main plutôt que trié par date, parce que la date SoundCloud n'est pas fiable
 * sur le back-catalogue (voir `date` ci-dessus).
 */
export const releases: CuratedRelease[] = [
  {
    slug: 'chrome-syndicate-dreams',
    title: 'Chrome Syndicate Dreams',
    artist: 'Grafenberg × Broken Shaman',
    kind: 'collab',
    soundcloud: 'chrome-syndicate-dreams',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/chrome-syndicate-dreams',
    accent: 'cyan',
  },
  {
    slug: 'the-eastern-skylight-tapes',
    title: 'The Eastern Skylight Tapes',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'the-eastern-skylight-tapes',
    // Bandcamp orthographie « skylights » — le slug diffère de SoundCloud.
    bandcamp: 'https://kineticdistro.bandcamp.com/album/the-eastern-skylights-tapes',
    accent: 'orange',
  },
  {
    slug: 'parallel-sin-theory',
    title: 'Parallel Sin Theory',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'parallel-sin-theory',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/parallel-sin-theory',
    accent: 'magenta',
  },
  {
    slug: 'the-wounds-of-tomorrow',
    title: 'The Wounds of Tomorrow',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'the-wounds-of-tomorrow',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/the-wounds-of-tomorrow',
    accent: 'orange',
  },
  {
    slug: 'ghost-frequencies-for-lost-machines',
    title: 'Ghost Frequencies for Lost Machines',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'ghost-frequencies-for-lost',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/ghost-frequencies-for-lost-machines',
    accent: 'cyan',
  },
  {
    slug: 'afterimage',
    title: 'Afterimage',
    artist: 'Grafenberg × Broken Shaman',
    kind: 'collab',
    soundcloud: 'afterimage',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/afterimage',
    accent: 'magenta',
  },
  {
    slug: 'the-halo-corruption-protocol',
    title: 'The Halo Corruption Protocol',
    artist: 'Grafenberg',
    kind: 'album',
    // Pas de set « album » sur SoundCloud, seulement la playlist de présentation,
    // téléversée en lot le 18/04/2026. Date réelle relevée sur Bandcamp.
    soundcloud: 'grafenberg-the-halo-corruption',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/the-halo-corruption-protocol',
    accent: 'violet',
    date: '2026-02-23',
  },
  {
    slug: 'erebions-dominion',
    title: "Erebion's Dominion",
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'erebions-dominion',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/erebions-dominion',
    accent: 'violet',
  },
  {
    slug: 'the-error-gospel',
    title: 'The Error Gospel',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'the-error-gospel',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/the-error-gospel',
    vinyl: 'https://elasticstage.com/soundcloud/releases/grafenberg-the-error-gospel-album',
    accent: 'cyan',
  },
  {
    slug: 'no-saints-no-proof',
    title: 'No Saints, No Proof',
    artist: 'Grafenberg',
    kind: 'album',
    soundcloud: 'no-saints-no-proof',
    bandcamp: 'https://kineticdistro.bandcamp.com/album/no-saints-no-proof',
    accent: 'orange',
    streaming: {
      spotify: 'https://open.spotify.com/intl-fr/album/1Rc7HhHY8dFrqlrQePv1TZ',
      appleMusic: 'https://music.apple.com/fr/album/no-saints-no-proof/1838489546',
      deezer: 'https://www.deezer.com/en/album/818044871',
      amazonMusic: 'https://music.amazon.fr/albums/B0FQ6RLCMV',
      qobuz: 'https://www.qobuz.com/fr-fr/album/no-saints-no-proof-grafenberg/tlegfmeco7l5b',
    },
  },
];

/**
 * Le reste du catalogue : EPs, relectures, singles.
 *
 * Séparé plutôt que trié, parce que la distinction n'est pas de degré. Un EP de
 * deux titres et une playlist de vingt-cinq remixes n'entrent pas dans la même
 * grille qu'un album sans en fausser la lecture.
 */
export const secondaryReleases: CuratedRelease[] = [
  {
    slug: 'teopolis-recoded-ep',
    title: 'Teopolis Recoded EP',
    artist: 'Grafenberg',
    kind: 'ep',
    soundcloud: 'teopolis-recoded',
    accent: 'cyan',
  },
  {
    slug: 'no-saints-no-proof-revisited',
    title: 'No Saints, No Proof — Revisited',
    artist: 'Chromabone',
    kind: 'remixes',
    soundcloud: 'no-saints-no-proof-revisited',
    accent: 'orange',
  },
  {
    slug: 'visions',
    title: 'Visions',
    artist: 'Grafenberg',
    kind: 'remixes',
    soundcloud: 'remixes',
    accent: 'violet',
  },
  {
    slug: 'chaos-i-bleed-ep',
    title: 'Chaos, I Bleed EP',
    artist: 'Grafenberg',
    kind: 'ep',
    soundcloud: 'chao-i-bleed-ep',
    accent: 'magenta',
  },
  {
    slug: 'circuits-in-silence',
    title: 'Circuits in Silence',
    artist: 'Grafenberg',
    kind: 'single',
    // Publié sur Bandcamp seulement — pas de set SoundCloud correspondant.
    bandcamp: 'https://kineticdistro.bandcamp.com/track/circuits-in-silence',
    accent: 'cyan',
  },
];

/** Tout le catalogue, dans l'ordre des deux tableaux. */
export const allReleases: CuratedRelease[] = [...releases, ...secondaryReleases];

export const findRelease = (slug: string): CuratedRelease | undefined =>
  allReleases.find((r) => r.slug === slug);

/** Le compte SoundCloud du label, qui héberge toutes les sorties Grafenberg. */
export const SOUNDCLOUD_USER_ID = 50014017;
export const SOUNDCLOUD_HANDLE = 'grafenbergmusik';

export const links = {
  soundcloud: `https://soundcloud.com/${SOUNDCLOUD_HANDLE}`,
  bandcamp: 'https://kineticdistro.bandcamp.com/music',
  label: 'https://www.kinetic-distro.com',
} as const;
