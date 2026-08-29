/**
 * DIMENSIONS DES VISUELS DE MARQUE
 * -----------------------------------------------------------------------------
 * Les dimensions réellement produites par `npm run assets`, pour que le balisage
 * n'ait pas à les recopier.
 *
 * Un `width`/`height` écrit à la main dans un composant dérive dès que la source
 * change de cadrage. C'est arrivé deux fois : le portrait déclaré carré alors
 * qu'il était en 4:3, puis déclaré 4:3 alors qu'il venait de passer en 4:5. Les
 * deux fois, le navigateur réservait la mauvaise place et la page sautait au
 * chargement. Ce qui est mesuré à l'encodage n'a pas à être redit ailleurs.
 * -----------------------------------------------------------------------------
 */

import manifest from './assets.generated.json';

type Dimension = { w: number; h: number };

const dimensions = manifest as Record<string, Dimension>;

/**
 * Les dimensions d'un visuel encodé.
 *
 * Le repli sur un carré n'arrive que si `npm run assets` n'a jamais tourné pour
 * ce nom — auquel cas le fichier manque aussi, et la place réservée est le
 * moindre des soucis.
 */
export const dimsOf = (name: string): Dimension => dimensions[name] ?? { w: 1, h: 1 };
