import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import albumArtwork from '@/assets/Album_artwork.jpg';
import LazyImage from '@/components/LazyImage';
interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  track_number: number;
}

export type AudioPlayerHandle = {
  setCurrentTrack: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  pause: () => void;
};

const AudioPlayer = React.forwardRef<AudioPlayerHandle, {}>((props, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const retryRef = useRef(0);
  const connectionType = (navigator as any)?.connection?.effectiveType as string | undefined;
  const isMobileOrTablet = typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false;
  const isPoorConnection = ['slow-2g', '2g', '3g'].includes(connectionType || '');

  useImperativeHandle(ref, () => ({
    setCurrentTrack: (index: number) => {
      setCurrentTrack(index);
      setProgress(0);
      const audio = audioRef.current;
      if (audio && tracks[index]?.preview_url) {
        audio.src = tracks[index].preview_url!;
      }
    },
    setIsPlaying: (playing: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        const url = tracks[currentTrack]?.preview_url;
        if (url) {
          audio.src = url;
          audio.play().catch((err) => {
            console.warn('Play via ref failed:', err);
          });
        }
      } else {
        audio.pause();
      }
      setIsPlaying(playing);
    },
    pause: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
    },
  }));

  // Album tracks with real track names (respect base path for GitHub Pages)
  const base = import.meta.env.BASE_URL || '/';
  const albumTracks: Track[] = [
    {
      id: '1',
      name: 'Nazar Engine',
      preview_url: `${base}audio/NoSaintsNoProof/01 - Nazar Engine.mp3`,
      duration_ms: 0,
      track_number: 1
    },
    {
      id: '2', 
      name: 'Pomegranate Static',
      preview_url: `${base}audio/NoSaintsNoProof/02 - Pomegranate Static.mp3`,
      duration_ms: 0,
      track_number: 2
    },
    {
      id: '3',
      name: 'Order Eats The Sun',
      preview_url: `${base}audio/NoSaintsNoProof/03 - Order Eats The Sun.mp3`,
      duration_ms: 0,
      track_number: 3
    },
    {
      id: '4',
      name: 'Tape Ghost Mirage',
      preview_url: `${base}audio/NoSaintsNoProof/04 - Tape Ghost Mirage.mp3`,
      duration_ms: 0,
      track_number: 4
    },
    {
      id: '5',
      name: 'Black Salt',
      preview_url: `${base}audio/NoSaintsNoProof/05 - Black Salt.mp3`,
      duration_ms: 0,
      track_number: 5
    },
    {
      id: '6',
      name: 'Chrome killim',
      preview_url: `${base}audio/NoSaintsNoProof/06 - Chrome killim.mp3`,
      duration_ms: 0,
      track_number: 6
    },
    {
      id: '7',
      name: 'Loom of Wires',
      preview_url: `${base}audio/NoSaintsNoProof/07 -  Loom of Wires.mp3`,
      duration_ms: 0,
      track_number: 7
    },
    {
      id: '8',
      name: 'VHS Desert Prayer',
      preview_url: `${base}audio/NoSaintsNoProof/08 - VHS Desert Prayer.mp3`,
      duration_ms: 0,
      track_number: 8
    },
    {
      id: '9',
      name: 'Motor Moon Communion',
      preview_url: `${base}audio/NoSaintsNoProof/09 - Motor Moon Communion.mp3`,
      duration_ms: 0,
      track_number: 9
    },
    {
      id: '10',
      name: 'Seraph on the Faultline',
      preview_url: `${base}audio/NoSaintsNoProof/10 - Seraph on the Faultline.mp3`,
      duration_ms: 0,
      track_number: 10
    }
  ];

  useEffect(() => {
    setTracks(albumTracks);
    
    // Preload track durations
    const preloadDurations = async () => {
      const updatedTracks = [...albumTracks];
      for (let i = 0; i < albumTracks.length; i++) {
        const track = albumTracks[i];
        if (track.preview_url) {
          try {
            const audio = new Audio(track.preview_url);
            await new Promise((resolve, reject) => {
              audio.addEventListener('loadedmetadata', () => {
                updatedTracks[i] = { ...track, duration_ms: audio.duration * 1000 };
                resolve(null);
              });
              audio.addEventListener('error', reject);
              audio.load();
            });
          } catch (error) {
            console.warn(`Failed to preload duration for track ${i + 1}:`, error);
          }
        }
      }
      setTracks(updatedTracks);
    };
    
    if (!isMobileOrTablet && !isPoorConnection) {
      preloadDurations();
    }
    // Auto-play on page load with improved reliability
    const startAutoPlay = () => {
      setIsPlaying(true);
      const audio = audioRef.current;
      if (audio && albumTracks[0]?.preview_url) {
        audio.src = albumTracks[0].preview_url;
        console.log('Autoplay attempt with URL:', audio.src);
        // Preload the audio first
        audio.load();
        audio.play().catch((err) => {
          console.warn('Autoplay blocked or failed:', err);
          setIsPlaying(false);
        });
      }
    };

    // Auto-play on first user interaction
    const handleFirstInteraction = () => {
      startAutoPlay();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // Try immediate autoplay first
    const timeoutId = setTimeout(() => {
      if (!isMobileOrTablet && !isPoorConnection) {
        startAutoPlay();
      }
    }, 500);

    // Fallback to user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Remove mouse movement visibility logic - player always visible

  // Audio setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration) {
        // Update the duration in tracks state when audio loads
        setTracks(prevTracks => 
          prevTracks.map((track, index) => 
            index === currentTrack 
              ? { ...track, duration_ms: audio.duration * 1000 }
              : track
          )
        );
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = () => {
      console.error('Audio error while loading/playing:', audio.src, audio.error);
      setIsBuffering(false);
      setLoadError('Erreur de lecture. Vérifiez votre connexion.');
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleStalled = () => setIsBuffering(true);
    const handlePlayingEv = () => {
      setIsBuffering(false);
      setLoadError(null);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('playing', handlePlayingEv);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('playing', handlePlayingEv);
    };
  }, [currentTrack]);

  // Keep audio volume in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      clearInterval(progressIntervalRef.current);
      console.log('Paused playback');
      setIsBuffering(false);
    } else {
      const currentTrackData = tracks[currentTrack];
      if (currentTrackData?.preview_url) {
        audio.src = currentTrackData.preview_url;
        console.log('Play attempt with URL:', audio.src);
        setIsBuffering(true);
        setLoadError(null);
        audio.load();
        audio.play().then(() => {
          setIsBuffering(false);
        }).catch((err) => {
          setIsBuffering(false);
          setLoadError('Impossible de démarrer la lecture.');
          console.warn('Play failed:', err);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const newTrackIndex = (currentTrack + 1) % tracks.length;
    setCurrentTrack(newTrackIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Auto-play next track
    const audio = audioRef.current;
    if (audio && tracks[newTrackIndex]?.preview_url) {
      audio.src = tracks[newTrackIndex].preview_url;
      setIsBuffering(true);
      setLoadError(null);
      audio.load();
      audio.play().then(() => setIsBuffering(false)).catch((err) => {
        setIsBuffering(false);
        console.warn('Auto-play next track failed:', err);
      });
    }
  };

  const prevTrack = () => {
    const newTrackIndex = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(newTrackIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Auto-play previous track
    const audio = audioRef.current;
    if (audio && tracks[newTrackIndex]?.preview_url) {
      audio.src = tracks[newTrackIndex].preview_url;
      setIsBuffering(true);
      setLoadError(null);
      audio.load();
      audio.play().catch((err) => {
        setIsBuffering(false);
        console.warn('Auto-play previous track failed:', err);
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  

  return (
    <>
      <audio ref={audioRef} preload="none" playsInline />
      
      {/* Desktop Player - Right Side */}
      <div className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isExpanded ? 'translate-x-0' : 'translate-x-72'
      }`}>
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-bronze/20 backdrop-blur-xl border-2 border-gold/30 rounded-l-xl p-3 text-gold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--gold)/0.4)] ${
            isExpanded ? '' : 'rounded-r-xl'
          }`}
        >
          {isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Desktop Player */}
        <div className="bg-bronze/20 backdrop-blur-xl border-2 border-gold/30 rounded-2xl p-6 w-80 shadow-[0_0_30px_hsl(var(--gold)/0.3)]">
          {/* Album Art & Track Info */}
          <div className="mb-4 flex gap-4">
            {/* Album Artwork */}
              <LazyImage
                src={albumArtwork}
                alt="No Saints, No Proof Album Cover"
                className="w-16 h-16 rounded-lg overflow-hidden border border-gold/30 flex-shrink-0"
              />
            
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-orbitron font-bold text-lg bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent mb-1">
                GRAFENBERG
              </h3>
              <p className="text-gold font-medium truncate">
                {tracks[currentTrack]?.name || 'No Saints, No Proof'}
              </p>
              <p className="text-gold/60 text-sm">
                Track {(currentTrack + 1).toString().padStart(2, '0')} of {tracks.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gold/60 mb-2">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-bronze/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-amber transition-all duration-300 shadow-[0_0_8px_hsl(var(--gold)/0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{formatTime(tracks[currentTrack]?.duration_ms / 1000 || 0)}</span>
            </div>
          </div>

          {/* Status */}
          {(isBuffering || loadError) && (
            <p className="text-gold/60 text-xs mb-2">
              {isBuffering ? 'Chargement en cours…' : loadError}
            </p>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTrack}
              className="text-gold hover:text-amber hover:bg-gold/10"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={togglePlay}
              className="rounded-full w-12 h-12 bg-gradient-to-r from-gold to-amber hover:from-gold-light hover:to-gold border border-gold/30 shadow-[0_0_20px_hsl(var(--gold)/0.4)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.6)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 text-bronze" /> : <Play className="w-6 h-6 text-bronze" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              className="text-gold hover:text-amber hover:bg-gold/10"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-gold/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-bronze/40 rounded-full appearance-none gold-slider"
            />
          </div>

          {/* Track List */}
          <div className="mt-4 max-h-32 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrack(index);
                  setIsPlaying(true);
                  setProgress(0);
                  setCurrentTime(0);
                  
                  // Auto-play selected track
                  const audio = audioRef.current;
                  if (audio && track.preview_url) {
                    audio.src = track.preview_url;
                    setIsBuffering(true);
                    setLoadError(null);
                    audio.load();
                    audio.play().then(() => setIsBuffering(false)).catch((err) => {
                      setIsBuffering(false);
                      console.warn('Auto-play selected track failed:', err);
                    });
                  }
                }}
                className={`w-full text-left p-2 rounded-lg transition-all duration-300 mb-1 ${
                  index === currentTrack 
                    ? 'bg-gold/20 text-gold border border-gold/30 shadow-[0_0_10px_hsl(var(--gold)/0.3)]' 
                    : 'text-gold/80 hover:bg-gold/10 hover:border hover:border-gold/20'
                }`}
              >
                <div className="text-sm font-medium truncate">{track.name}</div>
                <div className="text-xs text-gold/40">
                  {formatTime(track.duration_ms / 1000)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Player - Bottom Right */}
      <div className="lg:hidden fixed bottom-6 right-4 xs:right-6 z-50">
        {/* Mobile Floating Button */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-bronze/20 backdrop-blur-xl border-2 border-gold/30 rounded-full p-3 xs:p-4 text-gold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 shadow-[0_0_20px_hsl(var(--gold)/0.4)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.6)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 xs:w-6 xs:h-6" /> : <Play className="w-5 h-5 xs:w-6 xs:h-6" />}
          </button>
        )}

        {/* Mobile Expanded Player */}
        {isExpanded && (
          <div className="bg-bronze/20 backdrop-blur-xl border-2 border-gold/30 rounded-2xl p-4 xs:p-6 w-72 xs:w-80 shadow-[0_0_30px_hsl(var(--gold)/0.3)]">
            {/* Close Button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gold/60 hover:text-gold transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Album Art & Track Info */}
            <div className="mb-4 flex gap-3 xs:gap-4">
              {/* Album Artwork */}
                <LazyImage
                  src={albumArtwork}
                  alt="No Saints, No Proof Album Cover"
                  className="w-12 h-12 xs:w-16 xs:h-16 rounded-lg overflow-hidden border border-gold/30 flex-shrink-0"
                />
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-orbitron font-bold text-base xs:text-lg bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent mb-1">
                  GRAFENBERG
                </h3>
                <p className="text-gold font-medium text-sm xs:text-base truncate">
                  {tracks[currentTrack]?.name || 'No Saints, No Proof'}
                </p>
                <p className="text-gold/60 text-xs xs:text-sm">
                  Track {(currentTrack + 1).toString().padStart(2, '0')} of {tracks.length}
                </p>
              </div>
            </div>

            {/* Status */}
            {(isBuffering || loadError) && (
              <p className="text-gold/60 text-xs mb-2">
                {isBuffering ? 'Chargement en cours…' : loadError}
              </p>
            )}

            {/* Controls Only (No Progress Bar on Mobile) */}
            <div className="flex items-center justify-center gap-3 xs:gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTrack}
                className="text-gold hover:text-amber hover:bg-gold/10 p-2"
              >
                <SkipBack className="w-4 h-4 xs:w-5 xs:h-5" />
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={togglePlay}
                className="rounded-full w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-r from-gold to-amber hover:from-gold-light hover:to-gold border border-gold/30 shadow-[0_0_20px_hsl(var(--gold)/0.4)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.6)]"
              >
                {isPlaying ? <Pause className="w-5 h-5 xs:w-6 xs:h-6 text-bronze" /> : <Play className="w-5 h-5 xs:w-6 xs:h-6 text-bronze" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="text-gold hover:text-amber hover:bg-gold/10 p-2"
              >
                <SkipForward className="w-4 h-4 xs:w-5 xs:h-5" />
              </Button>
            </div>

            {/* Track List - Shortened for Mobile */}
            <div className="max-h-24 xs:max-h-32 overflow-y-auto">
              {tracks.slice(0, 5).map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(index);
                    setIsPlaying(true);
                    setProgress(0);
                    setCurrentTime(0);
                    
                    // Auto-play selected track
                     const audio = audioRef.current;
                     if (audio && track.preview_url) {
                       audio.src = track.preview_url;
                       setIsBuffering(true);
                       setLoadError(null);
                       audio.load();
                       audio.play().then(() => setIsBuffering(false)).catch((err) => {
                         setIsBuffering(false);
                         console.warn('Auto-play selected track failed:', err);
                       });
                     }
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-300 mb-1 ${
                    index === currentTrack 
                      ? 'bg-gold/20 text-gold border border-gold/30 shadow-[0_0_10px_hsl(var(--gold)/0.3)]' 
                      : 'text-gold/80 hover:bg-gold/10 hover:border hover:border-gold/20'
                  }`}
                >
                  <div className="text-xs xs:text-sm font-medium truncate">{track.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default AudioPlayer;