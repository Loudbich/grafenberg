import { useEffect, useState } from 'react';
import MainNavbar from '@/components/MainNavbar';
import AlbumHeroCarousel from '@/components/AlbumHeroCarousel';
import Artist from '@/components/Artist';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorTrail from '@/components/CursorTrail';
import VinylPurchase from '@/components/VinylPurchase';
import LoadingScreen from '@/components/LoadingScreen';
import { Music2, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';

// Album images
import albumArtwork from '@/assets/Album_artwork.jpg';
import errorGospelArtwork from '@/assets/The_Error_Gospel_Artwork.webp';

const Home = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading on first visit or hard refresh
    return !sessionStorage.getItem('siteLoaded');
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('siteLoaded', 'true');
    setIsLoading(false);
  };

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section > div');
    sections.forEach((section) => {
      section.classList.add('opacity-0', 'translate-y-8');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-deep overflow-x-hidden">
      <CursorTrail />
      <ScrollProgress />
      <MainNavbar />
      
      <main>
        {/* Hero Carousel */}
        <AlbumHeroCarousel />
        
        {/* Latest Releases Section */}
        <section className="relative py-24 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-deep via-surface/10 to-deep" />
          
          <div className="relative z-10 container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-neon">
                Dernières Sorties
              </h2>
              <div className="waveform max-w-xs mx-auto mb-6" />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez les derniers albums et singles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* No Saints No Proof Album Card */}
              <Link 
                to="/album/no-saints-no-proof"
                className="group glass rounded-2xl p-6 hover:glow-orange transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={albumArtwork}
                    alt="No Saints, No Proof"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-neon-orange/20 border border-neon-orange/40 rounded-full text-neon-orange text-xs font-medium">
                      Album • 2025
                    </span>
                  </div>
                </div>
                
                <h3 className="font-orbitron font-bold text-xl mb-2 text-foreground group-hover:text-neon-orange transition-colors duration-300">
                  No Saints, No Proof
                </h3>
                <p className="text-muted-foreground text-sm">
                  10 tracks • Synthwave / Deep Techno
                </p>
                
                <div className="mt-4 flex items-center text-neon-cyan text-sm font-medium">
                  <Disc className="w-4 h-4 mr-2" />
                  Écouter maintenant
                </div>
              </Link>

              {/* The Error Gospel Album Card */}
              <Link 
                to="/album/the-error-gospel"
                className="group glass rounded-2xl p-6 hover:glow-cyan transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={errorGospelArtwork}
                    alt="The Error Gospel"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/40 rounded-full text-neon-cyan text-xs font-medium">
                      Album • 2025
                    </span>
                  </div>
                </div>
                
                <h3 className="font-orbitron font-bold text-xl mb-2 text-foreground group-hover:text-neon-cyan transition-colors duration-300">
                  The Error Gospel
                </h3>
                <p className="text-muted-foreground text-sm">
                  10 tracks • Industrial / Dark Electronic
                </p>
                
                <div className="mt-4 flex items-center text-neon-magenta text-sm font-medium">
                  <Disc className="w-4 h-4 mr-2" />
                  Écouter maintenant
                </div>
              </Link>

              {/* Placeholder for future releases */}
              <div className="glass rounded-2xl p-6 border-dashed border-2 border-foreground/10 flex flex-col items-center justify-center min-h-[400px] text-center">
                <Music2 className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-orbitron font-bold text-lg text-muted-foreground/60 mb-2">
                  Prochainement
                </h3>
                <p className="text-muted-foreground/40 text-sm">
                  Erebion's Dominion
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vinyl Purchase Section */}
        <VinylPurchase albumId="the-error-gospel" />

        {/* Artist Section */}
        <Artist />

        {/* Contact/Links Section */}
        <section id="contact" className="relative py-24 px-6">
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-surface/5 to-deep" />
          
          <div className="relative z-10 container mx-auto max-w-4xl text-center">
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-gradient-cyber">
              Suivez Grafenberg
            </h2>
            <div className="waveform max-w-xs mx-auto mb-6" />
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Retrouvez toutes les dernières actualités et sorties sur vos plateformes préférées
            </p>
            
            <div className="glass rounded-2xl p-8 hover:glow-cyan transition-all duration-500">
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://open.spotify.com/intl-fr/album/1Rc7HhHY8dFrqlrQePv1TZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 glass rounded-xl border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover-glow-orange transition-all duration-300 font-semibold"
                >
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/fr/album/no-saints-no-proof/1838489546"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 glass rounded-xl border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan transition-all duration-300 font-semibold"
                >
                  Apple Music
                </a>
                <a
                  href="https://grafenbergnoir.bandcamp.com/album/no-saints-no-proof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 glass rounded-xl border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10 hover-glow-magenta transition-all duration-300 font-semibold"
                >
                  Bandcamp
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
