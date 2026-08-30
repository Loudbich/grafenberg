import type { Accent } from './releases';

/**
 * « THE WIDER UNIVERSE » — les quatre versants du projet
 * -----------------------------------------------------------------------------
 * La chanteuse permanente, les collaborations, la production pour d'autres, le
 * label. Ce sont les quatre choses que la biographie raconte, et cette section
 * les montre.
 *
 * AUCUN TITRE N'EST ÉCRIT ICI, et c'est délibéré : chaque bandeau porte son nom
 * peint dans l'image, dans sa propre typographie — le serif de Nyla Vey, la
 * pierre fendue de Broken Shaman, le lockup de Kinetic Distro. Superposer un
 * `<h4>` l'écrirait une seconde fois, dans une troisième police. Le nom vit
 * donc dans l'attribut `alt`, où il sert aux lecteurs d'écran sans être dessiné.
 *
 * Pour la même raison ces bandeaux ne reçoivent ni voile ni dégradé : leurs
 * luminosités vont du blanc crème au noir, et aucun voile unique ne peut
 * servir les deux. La description est posée SOUS l'image, sur le verre de la
 * carte, où son contraste est maîtrisé.
 * -----------------------------------------------------------------------------
 */
export type Facet = {
  /** Sert à la fois de clé de fichier (`public/universe/<slug>.webp`) et d'id. */
  slug: string;
  /** Ce que le bandeau montre. Va dans `alt`, jamais à l'écran. */
  name: string;
  description: string;
  accent: Accent;
  /** Lien sortant, quand il y a quelque part où aller. */
  href?: string;
};

export const facets: Facet[] = [
  {
    slug: 'nyla-vey',
    name: 'Nyla Vey',
    description:
      'The permanent voice of the solo work — intimacy, seduction and controlled intensity, not a guest feature.',
    accent: 'magenta',
  },
  {
    slug: 'broken-shaman',
    name: 'Broken Shaman',
    description:
      'Two collaborative albums where electronic architecture meets fractured hip-hop and urban soul.',
    accent: 'violet',
    href: 'https://www.kinetic-distro.com/roster/broken-shaman/',
  },
  {
    slug: 'hollow-static',
    name: 'Hollow Static',
    description:
      'Grafenberg produced their debut album — impossible memories, emotional distortion, invented lives.',
    accent: 'violet',
    href: 'https://www.kinetic-distro.com/roster/hollow-static/',
  },
  {
    slug: 'kinetic-distro',
    name: 'Kinetic Distro',
    description:
      'The label Grafenberg directs — connecting artists, records and visual identities into one universe.',
    accent: 'magenta',
    href: '/label',
  },
];
