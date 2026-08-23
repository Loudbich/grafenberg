import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { albums as catalogue, kindLabels, taglineOf, yearOf } from '@/data/catalog';

/**
 * Le bandeau d'accueil : les trois dernières sorties, en rotation.
 *
 * Il lisait auparavant sa propre liste d'albums écrite en dur — la troisième
 * source de vérité du site, à côté du JSON et de AudioPlayer, et celle qui
 * annonçait encore Erebion's Dominion comme « prochainement » huit mois après
 * sa sortie. Il lit maintenant le catalogue, comme tout le reste.
 */

/** Trois : au-delà, personne n'attend la rotation jusqu'au bout. */
const albums = catalogue.slice(0, 3);

const AlbumHeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const goToPrevious = () => {
    if (isAnimating) return;
    setSlideDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? albums.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (isAnimating) return;
    setSlideDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === albums.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance carousel (if more than one album)
  useEffect(() => {
    if (albums.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const currentAlbum = albums[currentIndex];

  // Le premier paragraphe de la présentation SoundCloud suffit ici ; le texte
  // entier appartient à la page de l'album. Un repli est nécessaire parce que
  // le sync peut n'avoir trouvé aucune description.
  const tagline =
    currentAlbum.description?.split('\n').find((line) => line.trim().length > 0) ??
    `${kindLabels[currentAlbum.kind]} by ${currentAlbum.artist}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image (always synced with the current album) */}
      <div className="absolute inset-0">
        {/* La petite variante suffit : cette image est étirée en pleine largeur
            sous une vignette, un dégradé et des scanlines, et aucun détail n'en
            ressort. La version 1000 px était chargée pour les trois diapositives
            — 600 ko pour un fond que personne ne regarde. */}
        <img
          key={`bg-${currentAlbum.slug}`}
          src={currentAlbum.coverSmall ?? currentAlbum.cover}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-vignette" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/50 to-transparent" />
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 xs:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Album Info */}
          <div className="text-center lg:text-left order-2 lg:order-1 overflow-hidden">
            <div 
              key={currentIndex}
              className={`transition-all duration-700 ease-out ${
                isAnimating 
                  ? slideDirection === 'right' 
                    ? 'animate-slide-in-right' 
                    : 'animate-slide-in-left'
                  : ''
              }`}
            >
              <span className="inline-block px-4 py-1 glass rounded-full text-neon-cyan text-sm font-medium mb-4">
                {yearOf(currentAlbum)} • {kindLabels[currentAlbum.kind]}
              </span>
              
              <h1 className="font-orbitron font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl mb-6 text-gradient-neon drop-shadow-2xl">
                {currentAlbum.title}
              </h1>
              
              <p className="text-lg xs:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                {tagline}
              </p>
              
              <div className="flex flex-col xs:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  className="bg-neon-orange text-deep hover:bg-neon-orange/90 hover-glow-orange px-8 py-6 text-lg font-orbitron font-bold"
                >
                  <Link to={`/album/${currentAlbum.slug}`}>
                    <Play className="w-5 h-5 mr-2" />
                    Discover
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Album Artwork */}
          <div className="order-1 lg:order-2 flex justify-center overflow-hidden">
            <Link 
              to={`/album/${currentAlbum.slug}`}
              key={`artwork-${currentIndex}`}
              className={`relative transition-all duration-700 ease-out cursor-pointer ${
                isAnimating 
                  ? 'animate-zoom-fade-in' 
                  : ''
              }`}
            >
              <div className="glass rounded-2xl p-3 hover:glow-cyan transition-all duration-500 group">
                <img
                  src={currentAlbum.cover}
                  srcSet={currentAlbum.coverSrcSet}
                  sizes="(min-width: 768px) 384px, 80vw"
                  alt={`${currentAlbum.title} cover`}
                  className="w-64 xs:w-72 sm:w-80 md:w-96 h-auto rounded-xl object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-cyan/30 rounded-full blur-sm animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-neon-orange/30 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-neon-magenta/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
            </Link>
          </div>
        </div>
        
        {/* Carousel Navigation (only if multiple albums) */}
        {albums.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={goToPrevious}
              className="p-2 glass rounded-full hover:glow-cyan transition-all duration-300"
              aria-label="Previous album"
            >
              <ChevronLeft className="w-6 h-6 text-neon-cyan" />
            </button>
            
            <div className="flex gap-2">
              {albums.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-neon-cyan w-6' 
                      : 'bg-foreground/30 hover:bg-foreground/50'
                  }`}
                  aria-label={`Go to album ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={goToNext}
              className="p-2 glass rounded-full hover:glow-cyan transition-all duration-300"
              aria-label="Next album"
            >
              <ChevronRight className="w-6 h-6 text-neon-cyan" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
        <div className="flex flex-col items-center text-neon-cyan/60">
          <span className="text-sm mb-2">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-neon-cyan/60 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default AlbumHeroCarousel;
