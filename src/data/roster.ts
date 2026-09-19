/**
 * LE ROSTER KINETIC DISTRO
 * -----------------------------------------------------------------------------
 * Les onze artistes du label, tels que la page /label les présente.
 *
 * CE FICHIER NE DÉCRIT PAS LES ARTISTES — il les désigne. Un nom, un genre en
 * deux mots, un visuel, et un lien vers leur page sur kinetic-distro.com.
 *
 * C'est délibéré. Le site du label tient déjà leurs biographies et leurs
 * discographies complètes ; les recopier ici donnerait deux versions de la même
 * chose à maintenir, dont l'une se périmerait en silence — et deux domaines
 * publiant le même contenu se desservent mutuellement dans les moteurs.
 *
 * La page de Grafenberg montre l'univers auquel il appartient ; celle du label
 * en garde le détail. C'est une passerelle, pas une copie.
 *
 * Les slugs sont ceux de kinetic-distro.com/roster/<slug>/ ET ceux des fichiers
 * dans `assets/roster kinetic distro/` : un seul identifiant pour les deux.
 * -----------------------------------------------------------------------------
 */

import type { Accent } from './releases';

/*
 * CE FICHIER RESTE PUR : aucune importation de JSON.
 *
 * `scripts/sync-assets.mjs` l'importe pour savoir quels bandeaux encoder, et
 * Node refuse une importation JSON sans attribut de type. Tout ce qui dépend du
 * manifeste d'encodage vit donc côté navigateur, dans `lib/rosterVisuals.ts`.
 */

export type RosterArtist = {
  /** Identifiant commun au lien du label et aux fichiers d'image. */
  slug: string;
  /** Nom de scène, dans la casse voulue par l'artiste. */
  name: string;
  /** Le genre en deux mots, tel qu'affiché sur le site du label. */
  genre: string;
  accent: Accent;
};

/** L'URL de la page d'un artiste sur le site du label. */
export const labelUrl = (slug: string) => `https://www.kinetic-distro.com/roster/${slug}/`;

/**
 * Le roster complet du label, dans l'ordre de son site.
 *
 * Grafenberg y figure parce que c'est un fait — il est de ce roster, et le
 * décompte affiché sur la page s'en déduit. Mais il n'apparaît pas dans la
 * grille : voir `otherArtists`.
 *
 * LES NOMS ET LES GENRES SONT RELEVÉS SUR kinetic-distro.com/roster/, non
 * inventés. Trois artistes ont changé de nom — Nyla Vey est devenue Nyla
 * Corvey, Hollow Static Residual Bloom, Love Cult Somerval — et sept autres
 * ont vu leur genre reformulé. Les slugs suivent, puisqu'ils servent à la fois
 * de lien vers le label et de clé pour les fichiers d'image.
 */
export const roster: RosterArtist[] = [
  { slug: 'grafenberg', name: 'Grafenberg', genre: 'French electronics / Cosmic disco', accent: 'magenta' },
  {
    slug: 'broken-shaman',
    name: 'Broken Shaman',
    genre: 'Fractured hip-hop / Experimental electronics',
    accent: 'violet',
  },
  { slug: 'chromabone', name: 'Chromabone', genre: 'Techno / Remix architecture', accent: 'magenta' },
  {
    slug: 'nosfera-disco-club',
    name: 'Nosfera Disco Club',
    genre: 'Dark disco / Mutant club',
    accent: 'violet',
  },
  {
    slug: 'vein-mirror',
    name: 'VEIN//MIRROR',
    genre: 'Industrial / Emotional architecture',
    accent: 'magenta',
  },
  {
    slug: 'anatolian-mirage',
    name: 'Anatolian Mirage',
    genre: 'Anatolian psychedelia / Dream-funk',
    accent: 'violet',
  },
  { slug: 'lykke', name: 'Lykke', genre: 'Swedish art-pop / Electronics', accent: 'magenta' },
  {
    slug: 'unmade-scores',
    name: 'Unmade Scores',
    genre: 'Imaginary cinema / Score',
    accent: 'violet',
  },
  { slug: 'nyla-corvey', name: 'Nyla Corvey', genre: 'Ethereal pop / Chamber', accent: 'magenta' },
  {
    slug: 'residual-bloom',
    name: 'Residual Bloom',
    genre: 'Dream pop / Post-human soul',
    accent: 'violet',
  },
  { slug: 'somerval', name: 'Somerval', genre: 'Dark electronic pop / Ritual club', accent: 'magenta' },
];

/**
 * Les artistes que la grille montre.
 *
 * Deux exclusions, pour deux raisons différentes.
 *
 * GRAFENBERG — une carte à son nom renvoyant vers kinetic-distro.com, sur son
 * propre site, enverrait le visiteur découvrir ailleurs celui dont il lit déjà
 * les pages.
 *
 * Le second filtre — celui des artistes sans bandeau — est appliqué par la
 * page, qui seule peut lire le manifeste d'encodage. Voir `lib/rosterVisuals`.
 *
 * Aucun de ces filtres ne touche `roster` : le label compte bien douze
 * artistes, c'est ce que la page annonce, et ce nombre doit rester vrai même
 * quand la grille en montre moins.
 */
export const otherArtists: RosterArtist[] = roster.filter((a) => a.slug !== 'grafenberg');
