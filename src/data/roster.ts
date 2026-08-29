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
 * Grafenberg en tête : c'est son site, et le visiteur doit se repérer avant de
 * découvrir les autres. Les dix suivants sont dans l'ordre du site du label.
 */
export const roster: RosterArtist[] = [
  { slug: 'grafenberg', name: 'Grafenberg', genre: 'Dark synthwave / Darkwave', accent: 'magenta' },
  {
    slug: 'broken-shaman',
    name: 'Broken Shaman',
    genre: 'Ritual electronics / Industrial',
    accent: 'orange',
  },
  {
    slug: 'chromabone',
    name: 'Chromabone',
    genre: 'Techno / Remix architecture',
    accent: 'magenta',
  },
  {
    slug: 'nosfera-disco-club',
    name: 'Nosfera Disco Club',
    genre: 'Dark disco / Italo',
    accent: 'violet',
  },
  {
    slug: 'vein-mirror',
    name: 'VEIN//Mirror',
    genre: 'Dark pop / Cinematic ritual',
    accent: 'cyan',
  },
  {
    slug: 'iron-covenant',
    name: 'Iron Covenant',
    genre: 'Thrash metal / East Coast',
    accent: 'orange',
  },
  {
    slug: 'anatolian-mirage',
    name: 'Anatolian Mirage',
    genre: 'Psychedelic / Microtonal',
    accent: 'orange',
  },
  { slug: 'lykke', name: 'Lykke', genre: 'Scandinavian pop', accent: 'cyan' },
  { slug: 'unmade-scores', name: 'Unmade Scores', genre: 'Cinematic / Score', accent: 'violet' },
  {
    slug: 'hollow-static',
    name: 'Hollow Static',
    genre: 'Dream pop / Post-human soul',
    accent: 'cyan',
  },
  { slug: 'love-cult', name: 'Love Cult', genre: 'Ritual pop / Drone', accent: 'violet' },
];
