import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { useAlbum } from '@/hooks/useAlbum';

// Import static assets for logos
import spotifyLogo from '@/assets/Spotify.png';
import appleLogo from '@/assets/Apple.png';
import deezerLogo from '@/assets/Deezer.png';
import bandcampLogo from '@/assets/bandcamp.png';
import amazonLogo from '@/assets/Amazon music.png';
import qobuzLogo from '@/assets/Qobuz.png';

// Import background and artwork
import backgroundAsset from '@/assets/Background.jpg';

const platformLogos: Record<string, string> = {
  spotify: spotifyLogo,
  appleMusic: appleLogo,
  deezer: deezerLogo,
  bandcamp: bandcampLogo,
  amazonMusic: amazonLogo,
  qobuz: qobuzLogo,
};

const platformColors: Record<string, string> = {
  spotify: 'hover-glow-orange',
  appleMusic: 'hover-glow-cyan',
  deezer: 'hover-glow-magenta',
  bandcamp: 'hover-glow-violet',
  amazonMusic: 'hover-glow-cyan',
  qobuz: 'hover-glow-orange',
};

const Hero = () => {
  const album = useAlbum('no-saints-no-proof');

  const scrollToHighlights = () => {
    const element = document.getElementById('highlights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!album) return null;

  // Build streaming platforms from album data
  const streamingPlatforms = Object.entries(album.streamingLinks)
    .filter(([_, url]) => url && url !== '#')
    .map(([key, url]) => ({
      name: key,
      url: url as string,
      logo: platformLogos[key],
      color: platformColors[key] || 'hover-glow-cyan',
    }));

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <LazyImage
          src={backgroundAsset}
          alt="Grafenberg synthwave background"
          className="w-full h-full bg-fixed"
        />
      </div>
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-vignette" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/40 to-transparent" />
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-30" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 xs:px-6 max-w-6xl mx-auto">
        {/* Main Title */}
        <h1 className="font-orbitron font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 xs:mb-6 text-gradient-neon drop-shadow-2xl animate-slide-up">
          {album.artist.toUpperCase()}
        </h1>
        
        {/* Subtitle */}
        <div className="mb-6 xs:mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-orbitron text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 text-foreground">
            {album.title}
          </h2>
          <div className="waveform max-w-xs mx-auto mb-4 opacity-80" />
          <p className="text-lg xs:text-xl md:text-2xl text-neon-cyan font-light">
            Out Now
          </p>
        </div>

        {/* Platform Badges */}
        <div className="mb-12 xs:mb-14 md:mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted-foreground mb-4 xs:mb-6 text-base xs:text-lg">Available on all platforms</p>
          <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            {streamingPlatforms.map((platform) => (
              <Button
                key={platform.name}
                asChild
                variant="outline"
                className={`glass border-white/20 text-foreground hover:text-deep transition-all duration-300 ${platform.color} inline-flex items-center justify-center h-8 xs:h-9 sm:h-10 md:h-12 lg:h-14 xl:h-16 px-1 xs:px-2 sm:px-3 md:px-4 min-w-[2rem] xs:min-w-[2.25rem] sm:min-w-[2.5rem] md:min-w-[3rem] lg:min-w-[3.5rem] xl:min-w-[4rem]`}
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                >
                  <img 
                    src={platform.logo} 
                    alt={platform.name}
                    className="block h-4 xs:h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain shrink-0"
                  />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="w-full flex justify-center">
          <button
            onClick={scrollToHighlights}
            className="animate-float text-neon-cyan hover:text-neon-orange transition-colors duration-300 hidden sm:block"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm font-medium">Discover More</span>
              <ChevronDown className="h-5 w-5 xs:h-6 xs:w-6" />
              <ChevronDown className="h-5 w-5 xs:h-6 xs:w-6 -mt-2 xs:-mt-3 opacity-60" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
