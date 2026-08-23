import type { Release } from '@/data/catalog';
import { accentOf } from '@/lib/accent';

/**
 * Les liens d'écoute d'une sortie, dans l'ordre où ils comptent.
 *
 * SoundCloud et Bandcamp d'abord : ce sont les deux plateformes où le catalogue
 * est complet. Les DSP ne sont renseignées que pour No Saints, No Proof et
 * n'apparaissent donc que là — un bouton « Spotify » menant à une recherche
 * vide vaut moins que pas de bouton.
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

  const entries: { label: string; href: string }[] = [
    ...(release.soundcloudUrl ? [{ label: 'SoundCloud', href: release.soundcloudUrl }] : []),
    ...(release.bandcamp ? [{ label: 'Bandcamp', href: release.bandcamp }] : []),
    ...Object.entries(release.streaming ?? {})
      .filter(([, href]) => href)
      .map(([key, href]) => ({ label: dspLabels[key] ?? key, href: href as string })),
  ];

  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
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
