import { useEffect, useRef, useState } from 'react';
import MainNavbar from '@/components/MainNavbar';
import TheErrorGospelHero from '@/components/TheErrorGospelHero';
import TheErrorGospelTrackCarousel from '@/components/TheErrorGospelTrackCarousel';
import TheErrorGospelHighlights from '@/components/TheErrorGospelHighlights';
import TheErrorGospelContact from '@/components/TheErrorGospelContact';
import VinylPurchase from '@/components/VinylPurchase';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorTrail from '@/components/CursorTrail';
import TheErrorGospelAudioPlayer, { TheErrorGospelAudioPlayerHandle } from '@/components/TheErrorGospelAudioPlayer';
import LoadingScreen from '@/components/LoadingScreen';

const AlbumTheErrorGospel = () => {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('siteLoaded');
  });
  const audioPlayerRef = useRef<TheErrorGospelAudioPlayerHandle>(null);
  const currentPlayingTrack = useRef<number | null>(null);
  const isCarouselPlaying = useRef(false);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('siteLoaded', 'true');
    setIsLoading(false);
  };

  const handleTrackPlay = (trackIndex: number) => {
    // Pause the main audio player when tracklist plays
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    currentPlayingTrack.current = trackIndex;
    isCarouselPlaying.current = true;
  };

  const handleCarouselPause = () => {
    isCarouselPlaying.current = false;
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
    <div className="min-h-screen bg-black overflow-x-hidden">
      <CursorTrail />
      <ScrollProgress />
      <MainNavbar />
      
      <TheErrorGospelAudioPlayer ref={audioPlayerRef} />
      
      <main>
        <TheErrorGospelHero />
        <VinylPurchase />
        <TheErrorGospelTrackCarousel 
          onTrackPlay={handleTrackPlay}
          currentPlayingTrack={currentPlayingTrack.current ?? undefined}
          isPlaying={isCarouselPlaying.current}
          onPause={handleCarouselPause}
        />
        <TheErrorGospelHighlights />
        <TheErrorGospelContact />
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumTheErrorGospel;
