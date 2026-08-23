import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Pause } from 'lucide-react';
import { useAlbum } from '@/hooks/useAlbum';

// Import images for track artwork
import albumArtwork from '@/assets/Album_artwork.jpg';
import imgNazar from '@/assets/Nazar Engine.jpg';
import imgPomegranate from '@/assets/Pomegranate Static.jpg';
import imgOrder from '@/assets/Order eats the sun.jpg';
import imgTape from '@/assets/Tape Ghost Mirage.jpg';
import imgBlack from '@/assets/Black Salt.jpg';
import imgChrome from '@/assets/Chrome Killim.jpg';
import imgLoom from '@/assets/Loom of Wires.jpg';
import imgVhs from '@/assets/VHS DESERT PRAYER.jpg';
import imgMotor from '@/assets/Motor Moon Communion.jpg';
import imgSeraph from '@/assets/Seraph on the Faultline.jpg';

// Map track names to imported images
const trackImages: Record<string, string> = {
  'Nazar Engine': imgNazar,
  'Pomegranate Static': imgPomegranate,
  'Order Eats The Sun': imgOrder,
  'Tape Ghost Mirage': imgTape,
  'Black Salt': imgBlack,
  'Chrome killim': imgChrome,
  'Loom of Wires': imgLoom,
  'VHS Desert Prayer': imgVhs,
  'Motor Moon Communion': imgMotor,
  'Seraph on the Faultline': imgSeraph,
};

interface TrackCarouselProps {
  onTrackPlay?: (trackIndex: number) => void;
  currentPlayingTrack?: number;
  isPlaying?: boolean;
  onPause?: () => void;
}

const TrackCarousel: React.FC<TrackCarouselProps> = ({ 
  onTrackPlay, 
  currentPlayingTrack = -1, 
  isPlaying = false,
  onPause 
}) => {
  const album = useAlbum('no-saints-no-proof');
  const [selectedTrack, setSelectedTrack] = useState<typeof album extends undefined ? never : NonNullable<typeof album>['tracks'][0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlaying, setModalPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Pause modal audio when main player starts playing
  useEffect(() => {
    if (isPlaying && modalPlaying) {
      setModalPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, modalPlaying]);

  if (!album) return null;

  const tracks = album.tracks;
  const base = import.meta.env.BASE_URL || '/';

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackClick = (track: typeof tracks[0]) => {
    setSelectedTrack(track);
    setModalOpen(true);
    setModalPlaying(false);
    setCurrentTime(0);
    onPause?.();
  };

  const handleModalPlay = () => {
    if (audioRef.current) {
      if (modalPlaying) {
        audioRef.current.pause();
        setModalPlaying(false);
      } else {
        onPause?.();
        audioRef.current.play();
        setModalPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrackImage = (track: typeof tracks[0]) => {
    return trackImages[track.name] || albumArtwork;
  };

  const getPreviewUrl = (track: typeof tracks[0]) => {
    if (!track.preview_url) return '';
    // Handle relative paths
    if (track.preview_url.startsWith('/')) {
      return `${base}${track.preview_url.slice(1)}`;
    }
    return track.preview_url;
  };

  return (
    <>
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent mb-6">
              TRACKLIST
            </h2>
            <p className="text-gold/80 text-lg max-w-2xl mx-auto">
              Discover the {tracks.length} tracks from "{album.title}"
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {tracks.map((track) => (
                  <CarouselItem key={track.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div 
                      className="group cursor-pointer"
                      onClick={() => handleTrackClick(track)}
                    >
                      <div className="relative overflow-hidden rounded-xl border-2 border-gold/20 bg-bronze/10 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] hover:scale-105">
                        {/* Track Image */}
                        <div className="aspect-square relative overflow-hidden">
                          <img 
                            src={getTrackImage(track)} 
                            alt={`${track.name} artwork`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = albumArtwork;
                            }}
                          />

                          {/* Track number */}
                          <div className="absolute top-3 left-3 bg-bronze/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-gold font-bold text-sm">{track.track_number}</span>
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="p-4">
                          <h3 className="font-orbitron font-bold text-gold text-lg mb-2 line-clamp-2 group-hover:text-amber transition-colors">
                            {track.name}
                          </h3>
                          <p className="text-gold/60 text-sm">
                            {formatTime(track.duration_ms)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-gold/30 bg-bronze/20 text-gold hover:bg-gold/20 hover:border-gold/50" />
              <CarouselNext className="border-gold/30 bg-bronze/20 text-gold hover:bg-gold/20 hover:border-gold/50" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-deep border-2 border-gold/30">
          {selectedTrack && (
            <>
              <DialogHeader>
                <DialogTitle className="font-orbitron text-2xl bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                  {selectedTrack.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {/* Image */}
                <div className="space-y-6">
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gold/30">
                    <img 
                      src={getTrackImage(selectedTrack)} 
                      alt={`${selectedTrack.name} artwork`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = albumArtwork;
                      }}
                    />
                  </div>
                </div>

                {/* Audio Player and Content */}
                <div className="space-y-6">
                  {/* Audio Player */}
                  <div className="bg-bronze/10 rounded-lg p-6 border border-gold/20">
                    <audio 
                      ref={audioRef}
                      src={getPreviewUrl(selectedTrack)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setModalPlaying(false)}
                    />
                    
                    {/* Play Button */}
                    <div className="flex items-center justify-center mb-4">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleModalPlay}
                        className="rounded-full w-16 h-16 bg-gradient-to-r from-gold to-amber hover:from-gold-light hover:to-gold border border-gold/30 shadow-[0_0_20px_hsl(var(--gold)/0.4)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.6)]"
                      >
                        {modalPlaying ? 
                          <Pause className="w-8 h-8 text-bronze" /> : 
                          <Play className="w-8 h-8 text-bronze" />
                        }
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-bronze/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                      />
                      
                      {/* Time Display */}
                      <div className="flex justify-between text-gold/80 text-sm">
                        <span>{formatTimeDisplay(currentTime)}</span>
                        <span>{formatTimeDisplay(duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-orbitron text-xl text-gold mb-3">Description</h3>
                    <p className="text-gold/80 leading-relaxed">
                      {selectedTrack.description}
                    </p>
                  </div>
                  
                  {/* Lyrics */}
                  <div>
                    <h3 className="font-orbitron text-xl text-gold mb-3">Lyrics</h3>
                    <div className="bg-bronze/10 rounded-lg p-4 border border-gold/20 max-h-60 overflow-y-auto">
                      <pre className="text-gold/80 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {selectedTrack.lyrics}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrackCarousel;
