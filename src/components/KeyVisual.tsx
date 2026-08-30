/**
 * LE VISUEL CLÉ — Grafenberg & Nyla Vey
 * -----------------------------------------------------------------------------
 * Un bandeau pleine largeur, posé juste avant la section « The Artist » : il
 * montre les deux personnes que la biographie présente ensuite, et Nyla Vey y
 * est au premier plan comme elle l'est dans le texte.
 *
 * AUCUN TEXTE PAR-DESSUS. L'image porte déjà le lettrage GRAFENBERG ; en
 * superposer un second dirait deux fois la même chose, et masquerait ce qu'on
 * vient de mettre en avant.
 *
 * DEUX CADRAGES, PAS UN REDIMENSIONNEMENT. Le visuel existe en 2,39:1 pour les
 * écrans larges et en 9:16 pour les téléphones. Recadrer le premier sur mobile
 * ne laisserait qu'une bande où les deux silhouettes seraient coupées ;
 * l'afficher en entier donnerait un ruban de 100 px de haut. `<picture>` sert
 * donc deux images distinctes, ce que les deux exports permettent précisément.
 *
 * Le point de bascule est 768 px, celui de `md:` dans Tailwind, pour que le
 * changement de cadrage coïncide avec celui de la mise en page.
 * -----------------------------------------------------------------------------
 */
import { dimsOf } from '@/data/assets';

const KeyVisual = () => (
  <section aria-label="Grafenberg & Nyla Vey" className="relative">
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet="/brand/key-visual-mobile-720.webp 720w, /brand/key-visual-mobile.webp 1080w"
        sizes="100vw"
        width={dimsOf('key-visual-mobile').w}
        height={dimsOf('key-visual-mobile').h}
      />
      <img
        src="/brand/key-visual.webp"
        srcSet="/brand/key-visual-1280.webp 1280w, /brand/key-visual-1920.webp 1920w, /brand/key-visual.webp 2560w"
        sizes="100vw"
        alt="Grafenberg and Nyla Vey on a rooftop, against a neon-lit night city"
        width={dimsOf('key-visual').w}
        height={dimsOf('key-visual').h}
        // Le bandeau est loin sous la ligne de flottaison : rien ne justifie de
        // le charger avant que le visiteur y arrive.
        loading="lazy"
        decoding="async"
        className="block w-full"
      />
    </picture>

    {/* Fondu vers le fond du site, en haut et en bas.
        Sans lui, l'image se termine par une arête horizontale nette au milieu
        d'une page qui n'en a aucune ailleurs — elle a l'air collée plutôt que
        posée. `pointer-events-none` pour que ces voiles n'interceptent rien. */}
    <div className="from-deep pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent" />
    <div className="from-deep pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
  </section>
);

export default KeyVisual;
