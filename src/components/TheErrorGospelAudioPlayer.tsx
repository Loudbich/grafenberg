import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import albumArtwork from '@/assets/The_Error_Gospel_Artwork.webp';
import LazyImage from '@/components/LazyImage';

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  track_number: number;
}

export type TheErrorGospelAudioPlayerHandle = {
  setCurrentTrack: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  pause: () => void;
};

const TheErrorGospelAudioPlayer = React.forwardRef<TheErrorGospelAudioPlayerHandle, {}>((props, ref) => {
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
  const isMobileOrTablet = typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false;

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

  // Album tracks for The Error Gospel
  const base = import.meta.env.BASE_URL || '/';
  const albumTracks: Track[] = [
    {
      id: '1',
      name: 'The Law of Ashes',
      preview_url: `${base}audio/ErrorGospel/01 - Grafenberg - The law of ashes.mp3`,
      duration_ms: 0,
      track_number: 1
    },
    {
      id: '2',
      name: 'Saint Error',
      preview_url: `${base}audio/ErrorGospel/02 - Grafenberg - Saint error.mp3`,
      duration_ms: 0,
      track_number: 2
    },
    {
      id: '3',
      name: 'Error Bloom',
      preview_url: `${base}audio/ErrorGospel/03 - Grafenberg - Error bloom.mp3`,
      duration_ms: 0,
      track_number: 3
    },
    {
      id: '4',
      name: 'No Proof',
      preview_url: `${base}audio/ErrorGospel/04 - Grafenberg - No proof.mp3`,
      duration_ms: 0,
      track_number: 4
    },
    {
      id: '5',
      name: 'Kinetic Veil',
      preview_url: `${base}audio/ErrorGospel/05 - Grafenberg - Kinetic veil.mp3`,
      duration_ms: 0,
      track_number: 5
    },
    {
      id: '6',
      name: 'Digital Mecca',
      preview_url: `${base}audio/ErrorGospel/06 - Grafenberg - Digital mecca.mp3`,
      duration_ms: 0,
      track_number: 6
    },
    {
      id: '7',
      name: 'The Radiant Error',
      preview_url: `${base}audio/ErrorGospel/07 - Grafenberg - The radiant error.mp3`,
      duration_ms: 0,
      track_number: 7
    },
    {
      id: '8',
      name: 'Embers Turn Electric',
      preview_url: `${base}audio/ErrorGospel/08 - Grafenberg - Embers turns electric.mp3`,
      duration_ms: 0,
      track_number: 8
    },
    {
      id: '9',
      name: 'Black Voltage Psalm',
      preview_url: `${base}audio/ErrorGospel/09 - Grafenberg - Black voltage psalm.mp3`,
      duration_ms: 0,
      track_number: 9
    },
    {
      id: '10',
      name: 'Mother of Static',
      preview_url: `${base}audio/ErrorGospel/10 - Grafenberg - Mother of static.mp3`,
      duration_ms: 0,
      track_number: 10
    }
  ];

  useEffect(() => {
    setTracks(albumTracks);
  }, []);

  // Autoplay on page load
  useEffect(() => {
    const startAutoPlay = () => {
      const audio = audioRef.current;
      if (audio && albumTracks[0]?.preview_url) {
        audio.src = albumTracks[0].preview_url;
        audio.volume = volume;
        setIsBuffering(true);
        audio.play().then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          setIsExpanded(true);
        }).catch((err) => {
          console.warn('Autoplay blocked:', err);
          setIsBuffering(false);
        });
      }
    };

    // Try autoplay after a short delay
    const autoplayTimeout = setTimeout(() => {
      startAutoPlay();
    }, 500);

    // Fallback: start on first user interaction
    const handleUserInteraction = () => {
      if (!isPlaying) {
        startAutoPlay();
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      clearTimeout(autoplayTimeout);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

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
      setIsBuffering(false);
    } else {
      const currentTrackData = tracks[currentTrack];
      if (currentTrackData?.preview_url) {
        audio.src = currentTrackData.preview_url;
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
      <div className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${isExpanded ? 'translate-x-0' : 'translate-x-72'
        }`}>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-amber-900/20 backdrop-blur-xl border-2 border-amber-500/30 rounded-l-xl p-3 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] ${isExpanded ? '' : 'rounded-r-xl'
            }`}
        >
          {isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Desktop Player */}
        <div className="bg-amber-900/20 backdrop-blur-xl border-2 border-amber-500/30 rounded-2xl p-6 w-80 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          {/* Album Art & Track Info */}
          <div className="mb-4 flex gap-4">
            <LazyImage
              src={albumArtwork}
              alt="The Error Gospel Album Cover"
              className="w-16 h-16 rounded-lg overflow-hidden border border-amber-500/30 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-orbitron font-bold text-lg bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-1">
                GRAFENBERG
              </h3>
              <p className="text-amber-400 font-medium truncate">
                {tracks[currentTrack]?.name || 'The Error Gospel'}
              </p>
              <p className="text-amber-400/60 text-sm">
                Track {(currentTrack + 1).toString().padStart(2, '0')} of {tracks.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-amber-400/60 mb-2">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-amber-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{formatTime(tracks[currentTrack]?.duration_ms / 1000 || 0)}</span>
            </div>
          </div>

          {/* Status */}
          {(isBuffering || loadError) && (
            <p className="text-amber-400/60 text-xs mb-2">
              {isBuffering ? 'Chargement en cours…' : loadError}
            </p>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTrack}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={togglePlay}
              className="rounded-full w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-amber-400/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-amber-900/40 rounded-full appearance-none amber-slider"
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

                  const audio = audioRef.current;
                  if (audio && track.preview_url) {
                    audio.src = track.preview_url;
                    setIsBuffering(true);
                    setLoadError(null);
                    audio.load();
                    audio.play().then(() => setIsBuffering(false)).catch((err) => {
                      setIsBuffering(false);
                      console.warn('Track selection play failed:', err);
                    });
                  }
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${index === currentTrack
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10'
                  }`}
              >
                <span className="text-xs w-5">{(index + 1).toString().padStart(2, '0')}</span>
                <span className="text-sm truncate flex-1 text-left">{track.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Player */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 rounded-full bg-amber-500 shadow-lg flex items-center justify-center hover:bg-amber-400 transition-colors"
          >
            <Play className="w-6 h-6 text-black" />
          </button>
        ) : (
          <div className="bg-amber-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 w-72 shadow-xl">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 text-amber-400/60 hover:text-amber-400"
            >
              ×
            </button>

            <div className="flex items-center gap-3 mb-3">
              <LazyImage
                src={albumArtwork}
                alt="The Error Gospel"
                className="w-12 h-12 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-amber-300 font-medium truncate text-sm">
                  {tracks[currentTrack]?.name || 'The Error Gospel'}
                </p>
                <p className="text-amber-400/60 text-xs">Grafenberg</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="sm" onClick={prevTrack} className="text-amber-400">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                onClick={togglePlay}
                className="rounded-full w-10 h-10 bg-amber-500 hover:bg-amber-400"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={nextTrack} className="text-amber-400">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

TheErrorGospelAudioPlayer.displayName = 'TheErrorGospelAudioPlayer';

export default TheErrorGospelAudioPlayer;
