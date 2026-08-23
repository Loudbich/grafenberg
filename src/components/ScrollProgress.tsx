import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-deep/50">
      <div 
        className="h-full bg-gradient-to-r from-neon-orange via-neon-cyan to-neon-magenta transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: `0 0 10px hsl(var(--neon-orange) / 0.5)`
        }}
      />
    </div>
  );
};

export default ScrollProgress;