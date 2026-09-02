import assets from '@/data/assets.generated.json';

/**
 * QUELS ARTISTES ONT LEURS BANDEAUX ?
 * -----------------------------------------------------------------------------
 * `npm run assets` inscrit dans le manifeste les dimensions de ce qu'il a
 * RÉELLEMENT produit. S'y fier remplace les exceptions écrites à la main : la
 * page portait un `slug !== 'iron-covenant'` pour contourner un fichier source
 * illisible, exception qui aurait survécu à sa correction et masqué le bandeau
 * une fois celui-ci réparé.
 *
 * Un artiste ajouté au roster apparaît donc de lui-même le jour où ses visuels
 * sont déposés, et disparaît si on les retire — sans qu'on ait à y repenser.
 *
 * Ce module est séparé de `data/roster.ts` parce que celui-ci est importé par
 * `scripts/sync-assets.mjs`, et que Node refuse une importation JSON sans
 * attribut de type.
 * -----------------------------------------------------------------------------
 */
const manifest = assets as Record<string, { w: number; h: number }>;

/** Le cadrage portrait, celui dont la grille ne peut pas se passer. */
export const hasTallVisual = (slug: string) => `roster-${slug}-tall` in manifest;

/** Le cadrage large, facultatif : la carte retombe sur le portrait sans lui. */
export const hasWideVisual = (slug: string) => `roster-${slug}` in manifest;
