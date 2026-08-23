import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Disc } from 'lucide-react';
import MainNavbar from '@/components/MainNavbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorTrail from '@/components/CursorTrail';
import SoundCloudPlayer from '@/components/SoundCloudPlayer';
import Seo from '@/components/Seo';
import { releaseSeo } from '@/lib/seo';
import StreamingLinks from '@/components/StreamingLinks';
import VinylPurchase from '@/components/VinylPurchase';
import NotFound from '@/pages/NotFound';
import { getRelease, kindLabels, formatDate, yearOf } from '@/data/catalog';
import { accentOf } from '@/lib/accent';

/**
 * LA page d'album — une seule, paramétrée par son slug.
 *
 * Elle remplace AlbumNoSaintsNoProof.tsx et AlbumTheErrorGospel.tsx, qui
 * étaient deux copies de la même page à un import près. À deux albums c'était
 * une maladresse ; à quinze c'eût été quinze fichiers à corriger à chaque
 * retouche.
 */
const AlbumPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const release = slug ? getRelease(slug) : undefined;

  // Un slug inconnu est un 404, pas une page vide. Rendre NotFound plutôt que
  // rediriger conserve l'URL fautive dans la barre d'adresse — c'est ce qui
  // permet à quelqu'un de voir sa faute de frappe.
  if (!release) return <NotFound />;

  const style = accentOf(release.accent);
  const tracks = release.tracklist;

  return (
    <div className="bg-deep min-h-screen overflow-x-hidden">
      <Seo route={releaseSeo(release)} />

      <CursorTrail />
      <ScrollProgress />
      <MainNavbar />

      <main className="px-6 pb-24 pt-32">
        <div className="container mx-auto max-w-5xl">
          <Link
            to="/#discography"
            className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            All releases
          </Link>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Pochette */}
            <div>
              {release.cover ? (
                <img
                  src={release.cover}
                  srcSet={release.coverSrcSet}
                  sizes="(min-width: 768px) 500px, 90vw"
                  alt={`${release.title} cover`}
                  width={1000}
                  height={1000}
                  className={`w-full rounded-2xl ${style.glow}`}
                />
              ) : (
                <div className="bg-surface/40 flex aspect-square w-full items-center justify-center rounded-2xl">
                  <Disc className="text-muted-foreground/30 h-20 w-20" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Identité du disque */}
            <div className="flex flex-col justify-center">
              <span
                className={`mb-4 inline-block w-fit rounded-full border px-3 py-1 text-xs font-medium ${style.border} ${style.bg} ${style.text}`}
              >
                {kindLabels[release.kind]}
                {yearOf(release) && ` • ${yearOf(release)}`}
              </span>

              <h1 className="font-orbitron text-gradient-neon mb-3 text-4xl font-bold md:text-5xl">
                {release.title}
              </h1>

              <p className="text-muted-foreground mb-2 text-lg">{release.artist}</p>

              {release.date && (
                <p className="text-muted-foreground/70 mb-8 text-sm">
                  Released {formatDate(release)}
                  {release.trackCount ? ` · ${release.trackCount} tracks` : ''}
                </p>
              )}

              <StreamingLinks release={release} />
            </div>
          </div>

          {/* Écoute */}
          {release.soundcloudUrl && (
            <section className="mt-16">
              <SoundCloudPlayer
                url={release.soundcloudUrl}
                title={release.title}
                accent={release.accent}
              />
            </section>
          )}

          {/* Présentation — telle que l'artiste l'a écrite sur SoundCloud.
              `whitespace-pre-line` parce que ces textes sont composés en
              paragraphes courts et que les aplatir les rend illisibles. */}
          {release.description && (
            <section className="mt-16">
              <h2 className="font-orbitron mb-6 text-2xl font-bold">About</h2>
              <div className="waveform mb-8 max-w-xs" />
              <p className="text-muted-foreground max-w-3xl whitespace-pre-line leading-relaxed">
                {release.description}
              </p>
            </section>
          )}

          {/* Vinyle — ne s'affiche que pour les disques qui en ont un. */}
          <VinylPurchase release={release} />

          {/* Tracklist */}
          {tracks.length > 0 && (
            <section className="mt-16">
              <h2 className="font-orbitron mb-6 text-2xl font-bold">Tracklist</h2>
              <div className="waveform mb-8 max-w-xs" />

              <ol className="glass divide-foreground/5 divide-y rounded-2xl">
                {tracks.map((track, i) => (
                  <li
                    key={`${i}-${track}`}
                    className="hover:bg-foreground/[0.03] flex items-center gap-4 px-6 py-4 transition-colors"
                  >
                    <span
                      className={`w-6 shrink-0 text-right font-mono text-sm ${style.text} tabular-nums`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-foreground">{track}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AlbumPage;
