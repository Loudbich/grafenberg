import { Download } from 'lucide-react';
import type { Release } from '@/data/catalog';
import { accentOf } from '@/lib/accent';

/**
 * Les liens d'écoute d'une sortie, dans l'ordre où ils comptent.
 *
 * SoundCloud et Bandcamp d'abord : ce sont les deux plateformes où le catalogue
 * est complet. Les DSP ne sont renseignées que pour No Saints, No Proof et
 * n'apparaissent donc que là — un bouton « Spotify » menant à une recherche
 * vide vaut moins que pas de bouton.
 *
 * Le téléchargement libre passe devant tout le reste quand il existe : c'est la
 * seule de ces actions qui donne quelque chose à garder, et elle est
 * temporaire. Elle mène au set SoundCloud, où se trouve le bouton — le site ne
 * peut pas servir les fichiers lui-même, et prétendre le contraire mènerait le
 * visiteur à une impasse.
 */

const dspLabels: Record<string, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  deezer: 'Deezer',
  amazonMusic: 'Amazon Music',
  qobuz: 'Qobuz',
};

type Props = { release: Release };

const StreamingLinks = ({ release }: Props) => {
  const style = accentOf(release.accent);

  // Quand le téléchargement est offert, sa pastille mène déjà au set : en
  // ajouter une seconde intitulée « SoundCloud » vers la même adresse ne
  // donnerait au visiteur qu'un choix entre deux mots pour un seul endroit.
  const montreSoundCloud = release.soundcloudUrl && !release.freeDownload;

  const entries: { label: string; href: string }[] = [
    ...(montreSoundCloud ? [{ label: 'SoundCloud', href: release.soundcloudUrl! }] : []),
    ...(release.bandcamp ? [{ label: 'Bandcamp', href: release.bandcamp }] : []),
    ...Object.entries(release.streaming ?? {})
      .filter(([, href]) => href)
      .map(([key, href]) => ({ label: dspLabels[key] ?? key, href: href as string })),
  ];

  if (!entries.length && !release.freeDownload) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {release.freeDownload && release.soundcloudUrl && (
        <a
          href={release.soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`glass inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition-all duration-300 ${style.border} ${style.bg} ${style.text} ${style.glow}`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Free download
        </a>
      )}
      {entries.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          // `noopener` n'est pas décoratif : sans lui, la page ouverte garde une
          // référence sur celle-ci via window.opener et peut la faire naviguer.
          rel="noopener noreferrer"
          className={`glass rounded-xl border px-5 py-3 font-semibold transition-all duration-300 ${style.border} ${style.text} ${style.glow}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
};

export default StreamingLinks;
