/**
 * COUCHE SEO
 * -----------------------------------------------------------------------------
 * Une fonction pure par route, qui renvoie tout ce dont le <head> a besoin :
 * titre, description, canonique, Open Graph et un graphe schema.org.
 *
 * Utilisée deux fois, à partir des mêmes fonctions — c'est ce qui garantit que
 * la page prérendue et la page naviguée annoncent exactement la même chose :
 *   · au build par `scripts/prerender.mjs`, qui l'inscrit dans un fichier HTML
 *     statique par URL, de sorte qu'aucun robot n'ait à exécuter de JavaScript ;
 *   · à l'exécution par <PageMeta/>, qui maintient le <head> correct pendant la
 *     navigation interne.
 *
 * CONCEPTION DU GRAPHE — c'est ce qui alimente réellement un panneau de
 * connaissances Google :
 *   · chaque entité porte un @id absolu et stable, qui ne change jamais ;
 *   · les entités se référencent par @id au lieu d'être recopiées ;
 *   · l'artiste est le pivot : chaque album pointe vers lui via `byArtist`, et
 *     lui pointe vers ses albums via `album`.
 * -----------------------------------------------------------------------------
 */

import { otherArtists, roster, labelUrl } from '@/data/roster';
import { contact } from '@/data/releases';
import {
  albums,
  catalogue,
  collabCount,
  kindLabels,
  links,
  soloCount,
  spellOut,
  spellOutCapitalised,
  taglineOf,
  type Release,
} from '@/data/catalog';

/** L'origine publique. Sans barre oblique finale. */
export const BASE_URL = 'https://www.grafenberg.ovh';

export const SITE_NAME = 'Grafenberg';

/**
 * Forme canonique d'une URL.
 *
 * Tout hébergeur statique — GitHub Pages compris — sert
 * `dist/album/afterimage/index.html` à l'adresse `/album/afterimage/` et
 * redirige en 301 la forme sans barre oblique. Émettre la barre partout fait
 * que les canoniques, le sitemap et les liens internes désignent tous l'URL qui
 * répond 200, si bien qu'aucun robot ne traverse de redirection.
 */
export const canonicalPath = (path: string) =>
  path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;

const abs = (path: string) => `${BASE_URL}${canonicalPath(path)}`;

/**
 * URL absolue d'un fichier, et non d'une page.
 *
 * `abs` ajoute une barre finale, ce qui est juste pour une route et faux pour
 * un fichier : `/covers/afterimage.webp/` est un 404, et une image cassée
 * suffit à faire écarter l'entité entière par un moteur.
 */
const assetUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

/**
 * L'image de partage par défaut, pour les pages qui n'en ont pas.
 *
 * Le visuel clé plutôt que la pochette du dernier album : il montre Grafenberg
 * et Nyla Vey, porte le lettrage, et son cadrage 2,39:1 tient dans la vignette
 * des réseaux sociaux sans être rogné — là où une pochette carrée y est
 * amputée en haut et en bas. Les pages d'album gardent la leur, qui est
 * évidemment le bon visuel pour elles.
 */
export const SHARE_IMAGE = '/brand/key-visual-1280.webp';

/**
 * Identifiants stables des entités.
 *
 * Le fragment (`#artist`) est ce qui distingue l'entité de la page qui la
 * décrit. Sans lui, l'artiste et la page d'accueil porteraient le même @id et
 * seraient fusionnés en une seule chose, mi-personne mi-document.
 */
export const ID = {
  artist: `${BASE_URL}/#artist`,
  website: `${BASE_URL}/#website`,
  label: 'https://www.kinetic-distro.com/#organization',
  album: (slug: string) => `${abs(`/album/${slug}`)}#album`,
};

/* -------------------------------------------------------------------------- */
/* Entités                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * L'artiste.
 *
 * `deep` n'est vrai que sur la page d'accueil : c'est là que le graphe doit
 * énumérer la discographie. Ailleurs, l'artiste n'est cité que par référence,
 * pour éviter de recopier quinze albums dans chaque page.
 */
export const artistEntity = ({ deep = false } = {}) => ({
  '@type': 'MusicGroup',
  '@id': ID.artist,
  name: SITE_NAME,
  alternateName: 'Ludovic Debay',
  url: `${BASE_URL}/`,
  genre: [
    'Dark Synthwave',
    'Darkwave',
    'Industrial',
    'Electronic',
    'Cosmic Disco',
    'Cinematic Electronica',
  ],
  foundingLocation: { '@type': 'Country', name: 'France' },
  description:
    `Producer, composer and world-builder. ${spellOutCapitalised(soloCount)} solo albums and ${spellOut(collabCount)} collaborative records with Broken Shaman, released by Kinetic Distro.`,
  recordLabel: { '@id': ID.label },
  // Le contact professionnel, déclaré : c'est ce qui permet à un moteur ou à un
  // assistant de répondre « comment joindre Grafenberg » au lieu de renvoyer
  // vers une page où il faudra chercher.
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'booking, press and licensing',
    name: contact.name,
    email: contact.email,
  },
  sameAs: [links.soundcloud, links.bandcamp, links.label],
  ...(deep && {
    album: albums.map((release) => ({ '@id': ID.album(release.slug) })),
  }),
});

const labelEntity = () => ({
  '@type': 'Organization',
  '@id': ID.label,
  name: 'Kinetic Distro',
  url: links.label,
});

const websiteEntity = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: `${BASE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': ID.artist },
});

/**
 * Un album.
 *
 * `deep` ajoute la tracklist. Elle n'a sa place que sur la page du disque : la
 * page d'accueil citant dix albums, y inclure leurs cent titres produirait un
 * graphe illisible pour un gain nul.
 */
export const albumEntity = (release: Release, { deep = false } = {}) => ({
  '@type': 'MusicAlbum',
  '@id': ID.album(release.slug),
  name: release.title,
  url: abs(`/album/${release.slug}`),
  ...(release.cover && { image: assetUrl(release.cover) }),
  byArtist: { '@id': ID.artist },
  ...(release.date && { datePublished: release.date }),
  albumProductionType:
    release.kind === 'remixes'
      ? 'https://schema.org/RemixAlbum'
      : 'https://schema.org/StudioAlbum',
  ...(release.kind === 'collab' && { albumReleaseType: 'https://schema.org/AlbumRelease' }),
  numTracks: release.trackCount ?? release.tracklist.length,
  recordLabel: { '@id': ID.label },
  sameAs: [release.soundcloudUrl, release.bandcamp].filter(Boolean),
  ...(deep &&
    release.tracklist.length > 0 && {
      track: release.tracklist.map((name, i) => ({
        '@type': 'MusicRecording',
        name,
        position: i + 1,
        byArtist: { '@id': ID.artist },
      })),
    }),
  // Le vinyle est une offre réelle : c'est ce qui permet à une fiche produit
  // d'apparaître, plutôt qu'un simple lien parmi d'autres.
  ...(release.vinyl && {
    offers: {
      '@type': 'Offer',
      url: release.vinyl,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }),
});

/* -------------------------------------------------------------------------- */
/* Routes                                                                     */
/* -------------------------------------------------------------------------- */

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  ogType: string;
  image?: string;
  noIndex?: boolean;
  lastmod?: string;
  /** Les entités de cette page, avant sérialisation. */
  graph: unknown[];
};

export function homeSeo(): RouteSeo {
  return {
    path: '/',
    title: 'Grafenberg — Dark synthwave & industrial electronics',
    description: `The complete Grafenberg discography: ${albums.length} albums of dark synthwave and industrial electronics, including two collaborations with Broken Shaman. Listen on SoundCloud and Bandcamp.`,
    ogType: 'website',
    image: SHARE_IMAGE,
    graph: [
      websiteEntity(),
      artistEntity({ deep: true }),
      labelEntity(),
      // Les albums en version courte : leur @id est déjà cité par `album`
      // ci-dessus, et les décrire ici les rend résolvables sans quitter la page.
      ...albums.map((release) => albumEntity(release)),
    ],
  };
}

export function releaseSeo(release: Release): RouteSeo {
  return {
    path: `/album/${release.slug}`,
    title: `${release.title} — ${release.artist}`,
    description: taglineOf(release),
    ogType: 'music.album',
    image: release.cover,
    lastmod: release.date,
    graph: [albumEntity(release, { deep: true }), artistEntity(), labelEntity()],
  };
}

export function labelSeo(): RouteSeo {
  return {
    path: '/label',
    title: 'Kinetic Distro — the label behind Grafenberg',
    description:
      // Le décompte est calculé : « Eleven » y était écrit en dur, et le label
      // est passé à douze artistes le jour où Nyla Vey l'a rejoint.
      `The independent label that releases Grafenberg’s records, and the one he directs. ${spellOutCapitalised(roster.length)} artists working at the intersection of genres, cultures and eras.`,
    ogType: 'website',
    image: SHARE_IMAGE,
    graph: [
      labelEntity(),
      artistEntity(),
      {
        '@type': 'CollectionPage',
        '@id': `${abs('/label')}#page`,
        url: abs('/label'),
        name: 'Kinetic Distro — the label behind Grafenberg',
        // Les artistes sont cités par nom et par URL, sans être décrits : leurs
        // fiches complètes vivent sur le site du label, et deux graphes
        // décrivant la même entité se contrediraient tôt ou tard.
        about: { '@id': ID.label },
        // Grafenberg est absent de cette liste — non par omission, mais parce
        // qu'il est déjà dans le graphe sous son @id canonique, via
        // `artistEntity()`. L'y remettre créerait un second nœud MusicGroup
        // pour la même personne, portant l'URL du label : deux entités là où il
        // n'y en a qu'une, ce qu'un moteur résout mal.
        mentions: otherArtists.map((artist) => ({
          '@type': 'MusicGroup',
          name: artist.name,
          genre: artist.genre,
          url: labelUrl(artist.slug),
        })),
      },
    ],
  };
}

export function notFoundSeo(): RouteSeo {
  return {
    path: '/404',
    title: 'Page not found',
    description: 'This page does not exist. Browse the Grafenberg discography instead.',
    ogType: 'website',
    image: SHARE_IMAGE,
    noIndex: true,
    graph: [websiteEntity()],
  };
}

/** Toutes les routes que le prérendu doit produire. */
export function allRoutes(): RouteSeo[] {
  return [homeSeo(), ...catalogue.map(releaseSeo), labelSeo(), notFoundSeo()];
}

/**
 * Le graphe d'une route, sérialisé.
 *
 * `@graph` plutôt qu'une suite de blocs JSON-LD séparés : c'est la forme dans
 * laquelle les entités peuvent se référencer par @id à travers toute la page.
 */
export const jsonLd = (route: RouteSeo) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': route.graph });

/** Le SEO de la route correspondant à un chemin, pour <PageMeta/>. */
export function seoForPath(pathname: string): RouteSeo {
  if (pathname === '/' || pathname === '') return homeSeo();
  if (pathname === '/label' || pathname === '/label/') return labelSeo();

  const match = pathname.match(/^\/album\/([^/]+)\/?$/);
  const release = match ? catalogue.find((r) => r.slug === match[1]) : undefined;

  return release ? releaseSeo(release) : notFoundSeo();
}

export { kindLabels };
