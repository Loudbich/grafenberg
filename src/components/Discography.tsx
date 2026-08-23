import ReleaseCard from '@/components/ReleaseCard';
import { albums, secondary } from '@/data/catalog';

/**
 * La discographie complète.
 *
 * Deux grilles et non une : les dix albums d'un côté, les EPs, relectures et
 * singles de l'autre. La distinction n'est pas de degré — un EP de deux titres
 * et une playlist de vingt-cinq remixes noieraient la lecture d'une grille
 * d'albums s'ils y étaient mêlés.
 */
const Discography = () => (
  <section id="discography" className="relative px-6 py-24">
    <div className="from-deep via-surface/10 to-deep absolute inset-0 bg-gradient-to-b" />

    <div data-reveal className="relative z-10 container mx-auto max-w-6xl">
      <div className="mb-16 text-center">
        <h2 className="font-orbitron text-gradient-neon mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
          Discography
        </h2>
        <div className="waveform mx-auto mb-6 max-w-xs" />
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {albums.length} albums, including {albums.filter((a) => a.kind === 'collab').length} in
          collaboration with Broken Shaman
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((release, i) => (
          <ReleaseCard key={release.slug} release={release} priority={i === 0} />
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="mt-24">
          <div className="mb-12 text-center">
            <h3 className="font-orbitron text-gradient-cyber mb-4 text-2xl font-bold md:text-3xl">
              EPs, remixes & singles
            </h3>
            <div className="waveform mx-auto max-w-xs" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {secondary.map((release) => (
              <ReleaseCard key={release.slug} release={release} />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

export default Discography;
