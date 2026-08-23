import React, { useEffect, useState, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const CursorTrail = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };

      setTrail(prevTrail => {
        const updatedTrail = [newPoint, ...prevTrail.slice(0, 15)];
        return updatedTrail;
      });
    };

    const updateTrail = () => {
      const now = Date.now();
      setTrail(prevTrail => 
        prevTrail.filter(point => now - point.timestamp < 800)
      );
      animationFrameRef.current = requestAnimationFrame(updateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const opacity = Math.max(0, 1 - age / 800);
        const scale = Math.max(0.1, 1 - age / 800);
        
        return (
          <div
            key={`${point.timestamp}-${index}`}
            className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-gold to-amber shadow-[0_0_20px_hsl(var(--gold)/0.8)]"
            style={{
              left: point.x - 8,
              top: point.y - 8,
              opacity,
              transform: `scale(${scale})`,
              transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
              boxShadow: `0 0 ${20 * opacity}px hsl(var(--gold) / ${opacity * 0.8})`,
            }}
          />
        );
      })}
    </div>
  );
};

export default CursorTrail;