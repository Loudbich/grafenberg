/**
 * ACCENTS NÉON
 * -----------------------------------------------------------------------------
 * Chaque sortie porte un accent (voir `Accent` dans data/releases.ts). Ce module
 * est la seule traduction de cet accent vers quelque chose d'affichable.
 *
 * Les couleurs sont définies en HSL dans `index.css` sous `--neon-*`, ce qui
 * permet de les composer avec une opacité en Tailwind (`text-neon-cyan/40`).
 * Mais l'iframe SoundCloud est un document tiers : il ne voit pas nos variables
 * CSS et n'accepte qu'un hexadécimal dans son paramètre `color`. Les deux
 * écritures de la même couleur doivent donc coexister, et coexister ICI plutôt
 * que dispersées — sans quoi elles divergent à la première retouche de charte.
 * -----------------------------------------------------------------------------
 */

import type { Accent } from '@/data/releases';

export type AccentStyle = {
  /** Couleur du texte. */
  text: string;
  /** La même couleur, appliquée au survol de la carte parente. */
  groupHoverText: string;
  /** Bordure discrète, pour les cartes au repos. */
  border: string;
  /** Fond très dilué, pour les pastilles. */
  bg: string;
  /** Halo au survol — les classes `glow-*` de index.css. */
  glow: string;
  /** Aplat plein, pour le bouton de lecture. */
  solid: string;
  /**
   * La même couleur en hexadécimal, pour le widget SoundCloud.
   * Sans le `#` : le paramètre d'URL l'ajoute lui-même.
   */
  hex: string;
};

export const accents: Record<Accent, AccentStyle> = {
  orange: {
    text: 'text-neon-orange',
    groupHoverText: 'group-hover:text-neon-orange',
    border: 'border-neon-orange/30',
    bg: 'bg-neon-orange/10',
    glow: 'hover:glow-orange',
    solid: 'bg-neon-orange',
    hex: 'ff6600',
  },
  cyan: {
    text: 'text-neon-cyan',
    groupHoverText: 'group-hover:text-neon-cyan',
    border: 'border-neon-cyan/30',
    bg: 'bg-neon-cyan/10',
    glow: 'hover:glow-cyan',
    solid: 'bg-neon-cyan',
    hex: '00e6ff',
  },
  magenta: {
    text: 'text-neon-magenta',
    groupHoverText: 'group-hover:text-neon-magenta',
    border: 'border-neon-magenta/30',
    bg: 'bg-neon-magenta/10',
    glow: 'hover:glow-magenta',
    solid: 'bg-neon-magenta',
    hex: 'fd26a3',
  },
  violet: {
    text: 'text-neon-violet',
    groupHoverText: 'group-hover:text-neon-violet',
    border: 'border-neon-violet/30',
    bg: 'bg-neon-violet/10',
    glow: 'hover:glow-violet',
    solid: 'bg-neon-violet',
    hex: '8c6fec',
  },
};

/**
 * Les classes Tailwind sont écrites en toutes lettres ci-dessus, jamais
 * composées (`text-neon-${accent}`), parce que Tailwind lit le source comme du
 * texte : une classe construite à l'exécution n'existe pas dans le CSS produit.
 */
export const accentOf = (accent: Accent): AccentStyle => accents[accent];
