import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remonte en haut à chaque changement de page.
 *
 * Un navigateur restaure la position de défilement quand il charge un document ;
 * dans une application à page unique, il n'y a qu'un document et rien ne se
 * charge, si bien qu'aller d'une pochette située en bas de la discographie vers
 * la page de l'album ouvrait celle-ci à mi-hauteur — sur la tracklist.
 *
 * Une ancre est honorée plutôt qu'ignorée : `/#discographie` doit viser la
 * discographie, que le lien vienne de la navigation ou du retour d'une page
 * d'album. Le navigateur ne le fait pas seul ici — la section n'existe pas
 * encore dans le document au moment où l'URL change.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // `instant` et non `smooth` : un défilement animé sur un changement de
      // page donne à voir tout ce qui sépare les deux, ce que personne n'a
      // demandé.
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // La cible peut n'être pas encore montée — en arrivant d'une page d'album,
    // l'accueil se peint après ce rendu. Un rAF suffit à attendre la peinture,
    // et l'absence de cible n'est pas une erreur : la page reste où elle est.
    const id = hash.slice(1);
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
