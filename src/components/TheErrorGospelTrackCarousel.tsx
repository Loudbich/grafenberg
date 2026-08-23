import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Pause } from 'lucide-react';
import { useAlbum } from '@/hooks/useAlbum';

// Import fallback artwork
import albumArtwork from '@/assets/The_Error_Gospel_Artwork.webp';

interface TrackCarouselProps {
  onTrackPlay?: (trackIndex: number) => void;
  currentPlayingTrack?: number;
  isPlaying?: boolean;
  onPause?: () => void;
}

const TheErrorGospelTrackCarousel: React.FC<TrackCarouselProps> = ({ 
  onTrackPlay, 
  currentPlayingTrack = -1, 
  isPlaying = false,
  onPause 
}) => {
  const album = useAlbum('the-error-gospel');
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
    if (audioRef.current && selectedTrack?.preview_url) {
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

  return (
    <>
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent mb-6">
              TRACKLIST
            </h2>
            <p className="text-amber-200/60 text-lg max-w-2xl mx-auto">
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
                      <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/20 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105">
                        {/* Track Image */}
                        <div className="aspect-square relative overflow-hidden">
                          <img 
                            src={albumArtwork} 
                            alt={`${track.name} artwork`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />

                          {/* Track number */}
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center border border-amber-500/30">
                            <span className="text-amber-400 font-bold text-sm">{track.track_number}</span>
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="p-4">
                          <h3 className="font-orbitron font-bold text-amber-300 text-lg mb-2 line-clamp-2 group-hover:text-amber-200 transition-colors">
                            {track.name}
                          </h3>
                          <p className="text-amber-400/60 text-sm">
                            {formatTime(track.duration_ms)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-amber-500/30 bg-black/40 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50" />
              <CarouselNext className="border-amber-500/30 bg-black/40 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-2 border-amber-500/30">
          {selectedTrack && (
            <>
              <DialogHeader>
                <DialogTitle className="font-orbitron text-2xl bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                  {selectedTrack.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {/* Image */}
                <div className="space-y-6">
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-500/30">
                    <img 
                      src={albumArtwork} 
                      alt={`${selectedTrack.name} artwork`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Audio Player and Content */}
                <div className="space-y-6">
                  {/* Audio Player */}
                  <div className="bg-black/40 rounded-lg p-6 border border-amber-500/20">
                    {selectedTrack.preview_url && (
                      <audio 
                        ref={audioRef}
                        src={selectedTrack.preview_url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setModalPlaying(false)}
                      />
                    )}
                    
                    {/* Play Button */}
                    <div className="flex items-center justify-center mb-4">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleModalPlay}
                        disabled={!selectedTrack.preview_url}
                        className="rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] disabled:opacity-50"
                      >
                        {modalPlaying ? 
                          <Pause className="w-8 h-8 text-black" /> : 
                          <Play className="w-8 h-8 text-black" />
                        }
                      </Button>
                    </div>

                    {selectedTrack.preview_url ? (
                      /* Progress Bar */
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-amber-900/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                        />
                        
                        {/* Time Display */}
                        <div className="flex justify-between text-amber-400/80 text-sm">
                          <span>{formatTimeDisplay(currentTime)}</span>
                          <span>{formatTimeDisplay(duration)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-amber-400/50 text-sm italic">
                        Preview audio coming soon
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-orbitron text-xl text-amber-300 mb-3">Description</h3>
                    <p className="text-amber-100/80 leading-relaxed">
                      {selectedTrack.description}
                    </p>
                  </div>
                  
                  {/* Lyrics */}
                  <div>
                    <h3 className="font-orbitron text-xl text-amber-300 mb-3">Lyrics</h3>
                    <div className="bg-black/40 rounded-lg p-4 border border-amber-500/20 max-h-60 overflow-y-auto">
                      <pre className="text-amber-100/80 whitespace-pre-wrap font-mono text-sm leading-relaxed">
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

export default TheErrorGospelTrackCarousel;
