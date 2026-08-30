import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { dimsOf } from '@/data/assets';

/**
 * LA BARRE DE NAVIGATION, ET LE MENU MOBILE
 * -----------------------------------------------------------------------------
 * LE MENU MOBILE EST SORTI DU <nav>, ET C'EST LA CORRECTION PRINCIPALE.
 *
 * Il en était l'enfant. Or `<nav>` reçoit la classe `.glass` — donc un
 * `backdrop-filter` — dès que le visiteur a défilé de 20 px. Et un
 * `backdrop-filter` fait de l'élément qui le porte le BLOC CONTENEUR de ses
 * descendants en `position: fixed` : leur `inset: 0` cesse alors de désigner la
 * fenêtre pour désigner la boîte de l'ancêtre.
 *
 * Conséquence : passé les vingt premiers pixels de défilement — c'est-à-dire
 * chaque fois qu'on ouvre ce menu en pratique — l'overlay se repliait dans la
 * barre de navigation, haute d'une centaine de pixels, au lieu de couvrir
 * l'écran. Les liens s'y empilaient hors du cadre.
 *
 * Le rendre frère du `<nav>` plutôt qu'enfant suffit : plus aucun ancêtre ne
 * porte de filtre, et `inset: 0` retrouve la fenêtre. C'est aussi pourquoi il
 * ne faut pas « réparer » cela avec un z-index : le problème n'a jamais été
 * l'empilement, mais le référentiel de positionnement.
 * -----------------------------------------------------------------------------
 */
const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /**
   * Tant que le menu couvre l'écran, la page ne doit pas défiler derrière lui.
   *
   * Sans ce verrou, un glissement du doigt sur l'overlay faisait défiler la
   * discographie invisible en dessous : à la fermeture, on ne se retrouvait
   * plus là où l'on avait ouvert le menu.
   */
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const precedent = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const surEchap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', surEchap);

    return () => {
      document.body.style.overflow = precedent;
      document.removeEventListener('keydown', surEchap);
    };
  }, [isMobileMenuOpen]);

  /**
   * Fermer sur changement de route.
   *
   * Les liens appellent déjà `closeMobileMenu`, mais pas le bouton « précédent »
   * du navigateur : on revenait sur la page d'avant avec le menu toujours
   * ouvert par-dessus.
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Deux albums y étaient nommés en dur : avec quinze sorties, la navigation
  // pointe vers la discographie plutôt que d'en désigner deux arbitrairement.
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/#discography', label: 'Discography' },
    { path: '/#artist', label: 'Artist' },
    { path: '/label', label: 'Label' },
    { path: '/#contact', label: 'Contact' },
  ];

  // Les ancres ne sont jamais « actives » : elles désignent une section de la
  // page courante, pas une page. Les comparer au pathname ferait clignoter
  // « Accueil » comme actif pendant que le visiteur lit la discographie.
  const isActive = (path: string) => !path.includes('#') && location.pathname === path;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
          scrolled ? 'glass py-2 xs:py-3 md:py-4' : 'py-3 xs:py-4 md:py-6'
        }`}
      >
        <div className="xs:px-6 container mx-auto flex items-center justify-between px-4">
          <Link to="/" className="relative z-50 transition-transform duration-300 hover:scale-105">
            <img
              src="/brand/logo.webp"
              srcSet="/brand/logo-384.webp 384w, /brand/logo.webp 640w"
              sizes="(min-width: 768px) 192px, 144px"
              alt="Grafenberg"
              // Les dimensions viennent du manifeste d'encodage : recopiées à la
              // main, elles dérivaient dès que la source changeait de cadrage.
              width={dimsOf('logo').w}
              height={dimsOf('logo').h}
              // Le logo est le premier élément visible de chaque page.
              loading="eager"
              className="xs:h-14 h-12 w-auto md:h-16"
            />
          </Link>

          <div className="hidden items-center space-x-6 md:flex lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 lg:text-base ${
                  isActive(link.path) ? 'text-accent' : 'text-foreground hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="hover:text-accent text-foreground relative z-50 p-2 transition-colors duration-300 md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* FRÈRE du <nav>, jamais son enfant — voir la note en tête de fichier. */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-deep/95 fixed inset-0 z-40 backdrop-blur-xl md:hidden"
        >
          {/* `100dvh` et non `100vh` : sur mobile, `vh` compte la barre du
              navigateur comme si elle n'était pas là, si bien qu'un contenu
              centré verticalement se retrouve en partie sous elle. `dvh` suit
              la hauteur réellement visible. */}
          <div className="relative flex min-h-[100dvh] flex-col items-center justify-center space-y-8 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`font-display xs:text-3xl text-2xl font-bold transition-colors duration-300 ${
                  isActive(link.path) ? 'text-accent' : 'text-foreground hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Points décoratifs. `relative` sur le conteneur ci-dessus est ce
                qui leur donne un référentiel : sans lui, ils se plaçaient par
                rapport à un ancêtre lointain et dérivaient hors du menu. */}
            <div
              className="bg-accent absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full opacity-60"
              aria-hidden="true"
            />
            <div
              className="bg-accent-alt absolute bottom-1/4 right-1/4 h-1.5 w-1.5 animate-pulse rounded-full opacity-40"
              style={{ animationDelay: '0.5s' }}
              aria-hidden="true"
            />
            <div
              className="bg-accent absolute left-1/6 top-1/2 h-1 w-1 animate-pulse rounded-full opacity-50"
              style={{ animationDelay: '1s' }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavbar;
