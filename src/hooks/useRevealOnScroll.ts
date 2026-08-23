import { useEffect } from 'react';

/**
 * APPARITION AU DÉFILEMENT
 * -----------------------------------------------------------------------------
 * Masque les blocs marqués `data-reveal`, puis les révèle quand ils entrent
 * dans la fenêtre.
 *
 * TROIS BOGUES ONT MOTIVÉ CETTE RÉÉCRITURE.
 *
 * 1. LE SEUIL. La version d'origine utilisait un IntersectionObserver réglé sur
 *    `threshold: 0.1` — 10 % de l'élément visibles d'un coup. Sur mobile, la
 *    discographie fait près de 7 400 px de haut : il aurait fallu en afficher
 *    740 simultanément, quand un téléphone n'offre que ~760 px de haut, moins
 *    la marge négative. Le rapport tombait à 0,10 au repos et EN DESSOUS dès que
 *    la barre du navigateur apparaissait. L'observateur ne se déclenchait alors
 *    jamais, et toute la discographie restait à `opacity: 0` — présente dans la
 *    page, invisible pour toujours.
 *
 *    Un pourcentage est le mauvais outil : il devient impossible à atteindre
 *    passé une certaine hauteur. Ce qu'on veut dire est « dès qu'il entre »,
 *    ce qui se mesure en pixels et non en proportion.
 *
 * 2. LA CIBLE. Le sélecteur était `section > div`, ce qui attrapait aussi les
 *    couches décoratives du bandeau — vignette, dégradé, scanlines — et les
 *    décalait de 32 px vers le bas. D'où un marqueur explicite : un bloc
 *    s'anime parce qu'on l'a demandé, pas parce qu'il se trouve être le premier
 *    enfant d'une section.
 *
 * 3. LE RISQUE DE FOND. Une animation décorative ne doit jamais pouvoir faire
 *    disparaître du contenu. C'est pourtant ce qui s'est produit, et pendant
 *    des semaines, parce que le masquage était inconditionnel et la révélation
 *    conditionnelle. Ici la révélation est recalculée à chaque défilement à
 *    partir de la position réelle des blocs : il n'existe aucun état où un bloc
 *    entré dans la fenêtre reste masqué.
 *
 * POURQUOI PAS IntersectionObserver — il reste la bonne API pour observer des
 * centaines d'éléments. Il y en a quatre. Un test de position sur quatre blocs,
 * calé sur `requestAnimationFrame`, coûte moins qu'un frame de l'animation
 * qu'il déclenche, et se raisonne sans subtilité de seuil ni de `rootMargin`.
 *
 * SÛRETÉ — le masquage est posé par JavaScript, jamais dans le HTML livré. Si
 * ce script ne s'exécute pas, la page reste visible sans animation : c'est le
 * bon sens d'échec. L'inverse — masquer en CSS, révéler en JS — rendrait la
 * page blanche au moindre incident.
 * -----------------------------------------------------------------------------
 */

/** Marge en pixels : le bloc s'anime en entrant vraiment, pas au ras du bord. */
const MARGE = 80;

/** Vrai si le bloc a franchi le bas de la fenêtre. */
export function estEntre(rect: { top: number; bottom: number }, hauteurFenetre: number) {
  // `bottom > 0` évite de révéler un bloc déjà entièrement remonté au-dessus —
  // sans quoi un lien d'ancre atterrissant en bas de page les révélerait tous.
  return rect.top < hauteurFenetre - MARGE && rect.bottom > 0;
}

export function useRevealOnScroll() {
  useEffect(() => {
    const cibles = new Set(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!cibles.size) return;

    // Une animation d'apparition est du mouvement décoratif : qui l'a désactivé
    // au niveau du système doit voir la page telle quelle, immédiatement.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cibles.forEach((el) => el.classList.add('opacity-0', 'translate-y-8'));

    let planifie = false;

    const reveler = () => {
      planifie = false;
      const h = window.innerHeight;
      for (const el of cibles) {
        if (!estEntre(el.getBoundingClientRect(), h)) continue;
        el.classList.add('animate-slide-up');
        el.classList.remove('opacity-0', 'translate-y-8');
        // Retiré de l'ensemble : un bloc révélé n'est plus jamais mesuré.
        cibles.delete(el);
      }
      if (!cibles.size) arreter();
    };

    const planifier = () => {
      if (planifie) return;
      planifie = true;
      requestAnimationFrame(reveler);
    };

    /**
     * Filet de sécurité.
     *
     * Tout ce qui précède suppose que les événements arrivent et que les frames
     * sont peintes. Si l'un ou l'autre venait à manquer — onglet en arrière-plan
     * au chargement, `requestAnimationFrame` suspendu, gestionnaire de
     * défilement perdu — du contenu resterait invisible, ce qui est précisément
     * la panne qu'on répare ici et qui a duré des semaines sans se voir.
     *
     * Deux secondes entre deux relevés de position sur quatre blocs : le coût
     * est indiscernable, et la boucle s'arrête d'elle-même dès que tout est
     * révélé. Un contrôle périodique n'est pas élégant ; du contenu invisible
     * l'est moins.
     */
    const filet = window.setInterval(reveler, 2000);

    const arreter = () => {
      window.clearInterval(filet);
      window.removeEventListener('scroll', planifier);
      window.removeEventListener('resize', planifier);
      document.removeEventListener('visibilitychange', planifier);
    };

    // `passive` : ce gestionnaire n'annule jamais l'événement, et le déclarer
    // évite au navigateur d'attendre pour savoir s'il doit défiler.
    window.addEventListener('scroll', planifier, { passive: true });
    window.addEventListener('resize', planifier);

    // Un onglet ouvert en arrière-plan ne peint pas : `requestAnimationFrame`
    // y est suspendu, et tout ce qui en dépend attend. On repasse donc quand
    // l'onglet redevient visible.
    document.addEventListener('visibilitychange', planifier);

    // Première passe SYNCHRONE, et non planifiée : c'est elle qui découvre ce
    // qui est déjà à l'écran au chargement. La faire dépendre d'une frame
    // reviendrait à laisser la page masquée tant qu'aucune n'est peinte —
    // exactement le genre de dépendance qui a produit le bogue d'origine.
    reveler();

    return arreter;
  }, []);
}
