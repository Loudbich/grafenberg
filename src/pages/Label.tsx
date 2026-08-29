import { ExternalLink } from 'lucide-react';
import MainNavbar from '@/components/MainNavbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorTrail from '@/components/CursorTrail';
import Seo from '@/components/Seo';
import { labelSeo } from '@/lib/seo';
import { otherArtists, roster, labelUrl, type RosterArtist } from '@/data/roster';
import { links, spellOut } from '@/data/catalog';
import { accentOf } from '@/lib/accent';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

/**
 * KINETIC DISTRO — LA PAGE PASSERELLE
 * -----------------------------------------------------------------------------
 * Les onze artistes du label, chacun renvoyant à sa page sur
 * kinetic-distro.com.
 *
 * ELLE NE RECOPIE RIEN. Pas de biographies, pas de discographies : le site du
 * label les tient déjà, et les dupliquer donnerait deux versions à maintenir
 * dont l'une se périmerait en silence — le défaut que ce projet a passé son
 * temps à réparer. Deux domaines publiant le même texte se desservent aussi
 * mutuellement dans les moteurs de recherche.
 *
 * Ce que cette page apporte, et que le site du label ne peut pas apporter :
 * elle situe Grafenberg. Sa biographie dit qu'il dirige artistiquement un label
 * et construit un univers ; ici, on le voit.
 * -----------------------------------------------------------------------------
 */

/**
 * Une carte d'artiste.
 *
 * Deux cadrages, comme le visuel clé : cinémascope à partir de `md`, portrait
 * en dessous. Iron Covenant n'a que le portrait — son fichier large s'est
 * révélé être un fichier audio renommé — d'où le repli, qui vaut aussi pour
 * tout artiste ajouté avant que ses visuels ne soient prêts.
 */
const ArtistCard = ({ artist, wide }: { artist: RosterArtist; wide: boolean }) => {
  const style = accentOf(artist.accent);
  const tall = `/roster/${artist.slug}-tall.webp`;

  return (
    <a
      href={labelUrl(artist.slug)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group glass relative block overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 ${style.glow}`}
    >
      <picture>
        {wide && (
          <source
            media="(min-width: 768px)"
            srcSet={`/roster/${artist.slug}-640.webp 640w, /roster/${artist.slug}.webp 1280w`}
            sizes="(min-width: 1024px) 560px, 90vw"
          />
        )}
        <img
          src={tall}
          srcSet={`/roster/${artist.slug}-tall-480.webp 480w, ${tall} 720w`}
          sizes="(min-width: 768px) 560px, 90vw"
          alt={artist.name}
          loading="lazy"
          decoding="async"
          // Le rapport est imposé, pas subi. Sans lui, la carte d'Iron
          // Covenant — qui retombe sur son cadrage portrait faute de visuel
          // large — mesurait 970 px de haut contre 229 pour les dix autres, et
          // crevait la grille. `object-cover` recadre au centre : c'est une
          // perte assumée sur une carte, contre une rangée disloquée.
          className="aspect-[9/16] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:aspect-[2.39/1]"
        />
      </picture>

      {/* Le dégradé n'est pas décoratif : ces visuels sont clairs par endroits,
          et le texte y deviendrait illisible sans un fond qui lui appartienne. */}
      <div className="from-deep via-deep/70 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-6 pt-20">
        <h3 className="font-orbitron text-foreground text-xl font-bold md:text-2xl">
          {artist.name}
        </h3>
        <p className={`mt-1 text-sm ${style.text}`}>{artist.genre}</p>
        <span className="text-muted-foreground mt-3 inline-flex items-center gap-1.5 text-xs">
          kinetic-distro.com
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
};

const Label = () => {
  useRevealOnScroll();

  return (
    <div className="bg-deep min-h-screen overflow-x-hidden">
      <Seo route={labelSeo()} />

      <CursorTrail />
      <ScrollProgress />
      <MainNavbar />

      <main className="px-6 pb-24 pt-32">
        <div data-reveal className="container mx-auto max-w-6xl">
          <header className="mb-16 text-center">
            <p className="text-neon-cyan font-orbitron mb-4 text-sm uppercase tracking-[0.3em]">
              The wider universe
            </p>
            <h1 className="font-orbitron text-gradient-neon mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Kinetic Distro
            </h1>
            <div className="waveform mx-auto mb-8 max-w-xs" />
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              The independent label that releases Grafenberg's records — and the one he directs.
              {' '}
              {spellOut(roster.length)[0].toUpperCase()}
              {spellOut(roster.length).slice(1)} artists working at the intersection of genres,
              cultures and eras, Grafenberg among them. Each carries a complete world rather than a
              track.
            </p>
            <a
              href={links.label}
              target="_blank"
              rel="noopener noreferrer"
              className="glass border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan mt-8 inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
            >
              Visit the label
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </header>
        </div>

        <div data-reveal className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {otherArtists.map((artist) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                // Le cadrage large n'est proposé que lorsqu'il existe : sans ce
                // test, la balise <source> pointerait vers un fichier absent et
                // la carte d'Iron Covenant resterait vide sur écran large.
                wide={artist.slug !== 'iron-covenant'}
              />
            ))}
          </div>

          <p className="text-muted-foreground/60 mt-12 text-center text-sm">
            Full biographies, discographies and releases on{' '}
            <a
              href={links.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              kinetic-distro.com
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Label;
