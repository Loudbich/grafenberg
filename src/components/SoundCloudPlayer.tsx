import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Accent } from '@/data/releases';
import { accentOf } from '@/lib/accent';

/**
 * LECTURE — façade SoundCloud, chargée à la demande et jamais avant
 * -----------------------------------------------------------------------------
 * Le widget est une iframe tierce. L'embarquer au chargement de la page
 * livrerait à SoundCloud l'adresse IP de chaque visiteur et lui laisserait poser
 * ses cookies avant que quiconque ait demandé à entendre quoi que ce soit. Les
 * pochettes de ce site sont hébergées localement pour cette raison précise ; la
 * même règle vaut ici.
 *
 * Le bouton est un vrai bouton, et l'iframe le remplace sur place avec
 * `auto_play` : appuyer une fois lance une fois. Le lien sortant vers SoundCloud
 * reste présent dans le balisage autour, si bien que ceci n'ajoute qu'une façon
 * de rester — sans jamais être la seule façon d'écouter.
 *
 * REMPLACE les 1 177 lignes de AudioPlayer.tsx et TheErrorGospelAudioPlayer.tsx,
 * qui servaient 176 Mo de MP3 depuis GitHub Pages.
 * -----------------------------------------------------------------------------
 */

type Props = {
  /** Permalien public d'un set SoundCloud. */
  url: string;
  /** Nommé dans le bouton et dans le titre de l'iframe, pour les lecteurs d'écran. */
  title: string;
  accent: Accent;
  /**
   * Un set déroule sa tracklist et a besoin de la place ; un titre seul, non.
   * Les hauteurs sont celles que SoundCloud documente pour son widget.
   */
  variant?: 'track' | 'set';
  className?: string;
};

const widgetSrc = (url: string, hex: string) => {
  const params = new URLSearchParams({
    url,
    color: hex,
    auto_play: 'true',
    hide_related: 'true',
    show_comments: 'false',
    show_reposts: 'false',
    show_teaser: 'false',
    show_user: 'true',
    visual: 'false',
  });
  return `https://w.soundcloud.com/player/?${params}`;
};

const SoundCloudPlayer = ({ url, title, accent, variant = 'set', className = '' }: Props) => {
  const [playing, setPlaying] = useState(false);
  const style = accentOf(accent);
  const height = variant === 'set' ? 450 : 166;

  if (playing) {
    return (
      <iframe
        title={`${title} — SoundCloud player`}
        src={widgetSrc(url, style.hex)}
        width="100%"
        height={height}
        loading="lazy"
        allow="autoplay"
        className={`block rounded-2xl border border-foreground/10 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      // La hauteur est reprise telle quelle : sans cela, la page se réorganise
      // sous le doigt du visiteur au moment où l'iframe prend la place du
      // bouton, et ce qu'il visait a bougé.
      style={{ minHeight: height }}
      className={`group glass flex w-full flex-col items-center justify-center gap-4 rounded-2xl border ${style.border} p-8 transition-all duration-500 ${style.glow} ${className}`}
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full ${style.solid} transition-transform duration-300 group-hover:scale-110`}
        aria-hidden="true"
      >
        <Play className="ml-1 h-7 w-7 fill-deep text-deep" />
      </span>
      <span className="text-center">
        <span className="font-display block text-lg font-bold text-foreground">
          Play the album
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {title} · loads the SoundCloud player
        </span>
      </span>
    </button>
  );
};

export default SoundCloudPlayer;
