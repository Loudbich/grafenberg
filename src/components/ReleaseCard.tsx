import { Link } from 'react-router-dom';
import { Disc, Download } from 'lucide-react';
import { badgeFor, yearOf, type Release } from '@/data/catalog';
import { accentOf } from '@/lib/accent';

/**
 * Une sortie dans une grille.
 *
 * Le même composant sert aux albums et aux sorties secondaires : ce qui les
 * distingue est la taille de la grille qui les contient, pas leur carte. Un EP
 * rendu plus petit qu'un album serait une hiérarchie dessinée deux fois.
 */

type Props = {
  release: Release;
  /**
   * La première carte de la page d'accueil est au-dessus de la ligne de
   * flottaison : elle doit se charger tout de suite, alors que les treize
   * autres ne doivent surtout pas.
   */
  priority?: boolean;
};

const ReleaseCard = ({ release, priority = false }: Props) => {
  const style = accentOf(release.accent);
  const year = yearOf(release);
  const tracks = release.trackCount ?? release.tracklist.length;

  return (
    <Link
      to={`/album/${release.slug}`}
      className={`group glass block rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 ${style.glow}`}
    >
      <div className="relative mb-6 overflow-hidden rounded-xl">
        {release.cover ? (
          <img
            src={release.cover}
            srcSet={release.coverSrcSet}
            // La grille fait une colonne sur mobile, deux à partir de md, trois
            // à partir de lg dans un conteneur de 1152px : ~340px au plus large.
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw"
            alt={`${release.title} cover`}
            width={1000}
            height={1000}
            loading={priority ? 'eager' : 'lazy'}
            // `sync` sur la première : le décodage asynchrone repousse d'une
            // frame l'image que le visiteur regarde déjà.
            decoding={priority ? 'sync' : 'async'}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Sans pochette (sync jamais lancé, ou sortie sans set SoundCloud) la
          // carte garde sa place dans la grille plutôt que de s'effondrer.
          <div className="flex aspect-square w-full items-center justify-center bg-surface/40">
            <Disc className="h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
          </div>
        )}

        <div className="from-deep/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        {/* Le téléchargement libre est signalé dès la grille : c'est ce qui
            distingue cette sortie des autres, et l'apprendre après avoir ouvert
            la page serait l'apprendre trop tard. */}
        {release.freeDownload && (
          <span
            className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.border} ${style.bg} ${style.text} backdrop-blur-sm`}
          >
            <Download className="h-3 w-3" aria-hidden="true" />
            Free
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${style.border} ${style.bg} ${style.text}`}
          >
            {badgeFor(release)}
            {year && ` • ${year}`}
          </span>
        </div>
      </div>

      <h3
        className={`font-orbitron text-foreground mb-1 text-xl font-bold transition-colors duration-300 ${style.groupHoverText}`}
      >
        {release.title}
      </h3>

      {/* Le nom n'est répété que lorsqu'il apporte quelque chose : sur le site de
          Grafenberg, « Grafenberg » sous chaque pochette est du bruit ; une
          collaboration ou une relecture par un tiers, non. */}
      {release.artist !== 'Grafenberg' && (
        <p className="text-muted-foreground/80 mb-1 text-sm">{release.artist}</p>
      )}

      {tracks > 0 && (
        <p className="text-muted-foreground text-sm">
          {tracks} track{tracks > 1 ? 's' : ''}
        </p>
      )}

      <div className={`mt-4 flex items-center text-sm font-medium ${style.text}`}>
        <Disc className="mr-2 h-4 w-4" aria-hidden="true" />
        Listen
      </div>
    </Link>
  );
};

export default ReleaseCard;
