import { Disc3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlbum } from '@/hooks/useAlbum';
import defaultArtwork from '@/assets/The_Error_Gospel_Artwork.webp';

interface VinylPurchaseProps {
  variant?: 'hero' | 'section';
  albumId?: string;
}

const VinylPurchase = ({ 
  variant = 'section',
  albumId = 'the-error-gospel'
}: VinylPurchaseProps) => {
  const album = useAlbum(albumId);
  
  // Use album data or defaults
  const albumName = album?.title || 'The Error Gospel';
  const albumImage = defaultArtwork; // Use imported image
  const purchaseUrl = album?.vinylUrl || 'https://elasticstage.com/soundcloud/releases/grafenberg-the-error-gospel-album';

  // Don't render if no vinyl URL
  if (!purchaseUrl || purchaseUrl === '') {
    return null;
  }
  
  if (variant === 'hero') {
    return (
      <div className="glass rounded-2xl p-6 md:p-8 border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-black/60 to-amber-950/20 hover:border-amber-400/50 transition-all duration-500 group">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Vinyl Image with spinning effect */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-500/40 shadow-2xl animate-spin-slow">
              <img 
                src={albumImage} 
                alt={`${albumName} Vinyl`}
                className="w-full h-full object-cover"
              />
              {/* Vinyl center hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black border-2 border-amber-500/60" />
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl -z-10 group-hover:bg-amber-400/30 transition-all duration-500" />
          </div>

          {/* Content */}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Disc3 className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Édition Vinyle</span>
            </div>
            <h3 className="font-orbitron font-bold text-xl md:text-2xl text-amber-100 mb-2">
              {albumName}
            </h3>
            <p className="text-amber-200/60 text-sm mb-4">
              Édition limitée pressage vinyle • Artwork exclusif
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30"
            >
              <a 
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Acheter le Vinyle
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 md:py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-amber-950/5 to-deep" />
      
      <div className="relative z-10 container mx-auto max-w-5xl">
        <div className="glass rounded-3xl p-8 md:p-12 border border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-black/40 to-amber-950/10 hover:border-amber-400/40 transition-all duration-500 group overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/5 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Vinyl Record Visual */}
            <div className="relative flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Vinyl disc */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700 shadow-2xl animate-spin-slow">
                  {/* Grooves */}
                  <div className="absolute inset-4 rounded-full border border-gray-600/30" />
                  <div className="absolute inset-8 rounded-full border border-gray-600/20" />
                  <div className="absolute inset-12 rounded-full border border-gray-600/20" />
                  <div className="absolute inset-16 rounded-full border border-gray-600/30" />
                  
                  {/* Label in center */}
                  <div className="absolute inset-[30%] rounded-full overflow-hidden border-2 border-amber-500/40">
                    <img 
                      src={albumImage}
                      alt={albumName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Center hole */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-600" />
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-2xl -z-10 group-hover:bg-amber-400/20 transition-all duration-700" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Disc3 className="w-6 h-6 text-amber-400 animate-pulse" />
                <span className="text-amber-400 text-sm md:text-base font-medium uppercase tracking-widest">
                  Édition Collector
                </span>
              </div>
              
              <h2 className="font-orbitron font-black text-3xl md:text-4xl lg:text-5xl text-amber-100 mb-4">
                {albumName}
              </h2>
              
              <p className="text-amber-200/70 text-base md:text-lg mb-6 max-w-xl">
                Découvrez l'expérience audio ultime avec le pressage vinyle de "{albumName}". 
                Une édition limitée avec un artwork exclusif et une qualité sonore exceptionnelle.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-amber-300/80 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Pressage haute qualité
                </div>
                <div className="flex items-center gap-2 text-amber-300/80 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Artwork exclusif
                </div>
                <div className="flex items-center gap-2 text-amber-300/80 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Édition limitée
                </div>
              </div>
              
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 text-black font-bold text-lg px-8 py-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-amber-500/40 hover:scale-105"
              >
                <a 
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <Disc3 className="w-5 h-5" />
                  Acheter le Vinyle
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VinylPurchase;
