import { useEffect, useState, useRef } from 'react';

import Hero from '@/components/Hero';
import TrackCarousel from '@/components/TrackCarousel';
import AlbumHighlights from '@/components/AlbumHighlights';
import Artist from '@/components/Artist';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import AudioPlayer from '@/components/AudioPlayer';
import CursorTrail from '@/components/CursorTrail';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<{ 
    setCurrentTrack: (index: number) => void;
    setIsPlaying: (playing: boolean) => void;
    pause: () => void;
  } | null>(null);

  const handleTrackPlay = (trackIndex: number) => {
    setCurrentTrack(trackIndex);
    setIsPlaying(true);
    // Sync with main audio player
    if (audioPlayerRef.current) {
      audioPlayerRef.current.setCurrentTrack(trackIndex);
      audioPlayerRef.current.setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-deep overflow-x-hidden">
      <CursorTrail />
      <ScrollProgress />
      
      <AudioPlayer ref={audioPlayerRef} />
      <main>
        <Hero />
        <TrackCarousel 
          onTrackPlay={handleTrackPlay}
          currentPlayingTrack={currentTrack}
          isPlaying={isPlaying}
          onPause={handlePause}
        />
        <AlbumHighlights />
        <Artist />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;