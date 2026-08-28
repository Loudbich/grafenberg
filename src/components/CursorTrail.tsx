import { useEffect, useRef, useState } from 'react';

/**
 * LA TRAÎNÉE DE CURSEUR
 * -----------------------------------------------------------------------------
 * Une comète dorée qui suit la souris. Purement décoratif.
 *
 * TROIS CORRECTIONS.
 *
 * 1. LA BOUCLE NE S'ARRÊTAIT JAMAIS. Un `requestAnimationFrame` récursif
 *    appelait `setTrail` à chaque frame, pour toute la durée de la visite —
 *    soixante rendus React par seconde, y compris quand la traînée était vide
 *    et qu'il n'y avait donc rien à effacer. La boucle ne tourne désormais que
 *    tant qu'il reste des points à faire disparaître.
 *
 * 2. IL TOURNAIT SUR MOBILE. Un téléphone n'a pas de curseur : la traînée y
 *    restait vide en permanence, mais la boucle, elle, consommait la batterie
 *    du début à la fin. Le composant ne se monte plus que là où un pointeur
 *    fin existe.
 *
 * 3. IL IGNORAIT `prefers-reduced-motion`. Un objet lumineux qui poursuit le
 *    curseur est exactement le type de mouvement que ce réglage écarte.
 *
 * Ces trois tests se font dans un effet et non au rendu : le prérendu s'exécute
 * dans Node, où ni `window` ni `matchMedia` n'existent.
 * -----------------------------------------------------------------------------
 */

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

/** Durée de vie d'un point, en millisecondes. */
const VIE = 800;

/** Longueur de la traînée. Au-delà, elle devient une flaque. */
const LONGUEUR = 15;

const CursorTrail = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [actif, setActif] = useState(false);
  const frameRef = useRef<number>();

  // Décide si la traînée a lieu d'être, une fois côté navigateur.
  useEffect(() => {
    const finPointeur = window.matchMedia('(pointer: fine)').matches;
    const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setActif(finPointeur && !mouvementReduit);
  }, []);

  useEffect(() => {
    if (!actif) return;

    const purger = () => {
      const maintenant = Date.now();
      setTrail((points) => {
        const restants = points.filter((p) => maintenant - p.timestamp < VIE);
        // La boucle s'arrête quand il n'y a plus rien à estomper, et repart au
        // prochain mouvement. C'est toute la différence entre une animation et
        // une minuterie qui tourne à vide.
        frameRef.current = restants.length ? requestAnimationFrame(purger) : undefined;
        return restants;
      });
    };

    const onMove = (e: MouseEvent) => {
      setTrail((points) => [
        { x: e.clientX, y: e.clientY, timestamp: Date.now() },
        ...points.slice(0, LONGUEUR),
      ]);
      if (frameRef.current === undefined) frameRef.current = requestAnimationFrame(purger);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    };
  }, [actif]);

  if (!actif || trail.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const opacity = Math.max(0, 1 - age / VIE);
        const scale = Math.max(0.1, 1 - age / VIE);

        return (
          <div
            key={`${point.timestamp}-${index}`}
            className="from-gold to-amber absolute h-4 w-4 rounded-full bg-gradient-to-r"
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
