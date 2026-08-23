import { useEffect } from 'react';
import MainNavbar from '@/components/MainNavbar';
import AlbumHeroCarousel from '@/components/AlbumHeroCarousel';
import Discography from '@/components/Discography';
import Artist from '@/components/Artist';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorTrail from '@/components/CursorTrail';
import Seo from '@/components/Seo';
import { homeSeo } from '@/lib/seo';
import VinylPurchase from '@/components/VinylPurchase';
import { links, onVinyl } from '@/data/catalog';

/**
 * L'écran de chargement a été retiré.
 *
 * Il masquait le démarrage d'une application monolithique qui devait tout
 * télécharger avant de peindre quoi que ce soit. Les pages étant désormais
 * prérendues en HTML statique, le contenu est déjà là au premier octet : le
 * couvrir d'une animation reviendrait à retarder ce qui est déjà affiché.
 *
 * Il posait par ailleurs un problème d'hydratation — le serveur rendait la
 * page, le client rendait l'écran de chargement, et les deux arbres ne
 * correspondaient plus.
 */
const Home = () => {
  useEffect(() => {
    // Animation d'apparition au défilement.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          // Une fois la section apparue, il n'y a plus rien à observer : sans
          // cela, l'observateur continue de rapporter à chaque défilement pour
          // des éléments dont l'animation est déjà jouée.
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const sections = document.querySelectorAll('section > div');
    sections.forEach((section) => {
      section.classList.add('opacity-0', 'translate-y-8');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-deep min-h-screen overflow-x-hidden">
      <Seo route={homeSeo()} />

      <CursorTrail />
      <ScrollProgress />
      <MainNavbar />

      <main>
        <AlbumHeroCarousel />

        <Discography />

        {/* Le seul disque pressé à ce jour. La liste est filtrée dans le
            catalogue, si bien qu'un second pressage s'ajoutera tout seul. */}
        {onVinyl.map((release) => (
          <VinylPurchase key={release.slug} release={release} />
        ))}

        <Artist />

        <section id="contact" className="relative px-6 py-24">
          <div className="from-deep via-surface/5 to-deep absolute inset-0 bg-gradient-to-t" />

          <div className="relative z-10 container mx-auto max-w-4xl text-center">
            <h2 className="font-orbitron text-gradient-cyber mb-6 text-4xl font-bold md:text-5xl">
              Follow Grafenberg
            </h2>
            <div className="waveform mx-auto mb-6 max-w-xs" />
            <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl">
              The full catalogue lives on SoundCloud and Bandcamp. Records are released by
              Kinetic Distro.
            </p>

            <div className="glass hover:glow-cyan rounded-2xl p-8 transition-all duration-500">
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={links.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover-glow-orange rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
                >
                  SoundCloud
                </a>
                <a
                  href={links.bandcamp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10 hover-glow-magenta rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
                >
                  Bandcamp
                </a>
                <a
                  href={links.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
                >
                  Kinetic Distro
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
