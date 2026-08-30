import { Mail } from 'lucide-react';
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
import KeyVisual from '@/components/KeyVisual';
import { contact, links, onVinyl } from '@/data/catalog';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

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
  useRevealOnScroll();

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

        {/* Le visuel clé ouvre la section artiste : on voit les deux personnes
            avant de lire qui elles sont. */}
        <KeyVisual />

        <Artist />

        <section id="contact" className="relative px-6 py-24">
          <div className="from-deep via-surface/5 to-deep absolute inset-0 bg-gradient-to-t" />

          <div data-reveal className="relative z-10 container mx-auto max-w-4xl text-center">
            <h2 className="font-display text-gradient-cyber mb-6 text-4xl font-bold md:text-5xl">
              Get in touch
            </h2>
            <div className="waveform mx-auto mb-6 max-w-xs" />
            <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl">
              Booking, press, sync and licensing — and the full catalogue on SoundCloud and
              Bandcamp.
            </p>

            {/* Le contact passe AVANT les liens de plateformes.
                Quelqu'un qui descend jusqu'ici cherche à joindre quelqu'un ;
                celui qui voulait seulement écouter a déjà cliqué plus haut. */}
            <div className="glass hover:glow-accent mb-6 rounded-2xl p-8 transition-all duration-500">
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex flex-col items-center gap-1"
              >
                <span className="text-accent mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Contact
                </span>
                <span className="font-display text-foreground group-hover:text-accent text-xl font-bold transition-colors duration-300 md:text-2xl">
                  {contact.email}
                </span>
                <span className="text-muted-foreground mt-2 text-sm">
                  {contact.name} — {contact.role}
                </span>
              </a>
            </div>

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
