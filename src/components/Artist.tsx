import { Mic2, Users, Disc3, Compass } from 'lucide-react';
import { links } from '@/data/catalog';

/**
 * L'artiste.
 *
 * Les quatre encarts ne listent plus des compétences génériques — « Mixing
 * Engineer », « Creative Vision » — mais les quatre versants réels du projet
 * décrits dans la biographie : la chanteuse permanente, les collaborations, la
 * production pour d'autres, la direction du label. Ils disaient auparavant ce
 * que fait n'importe quel producteur ; ils disent maintenant ce que fait
 * celui-ci.
 *
 * Leurs classes de couleur sont écrites en toutes lettres. La version
 * précédente les composait (`bg-${color}/10`, `text-${color}`), ce que Tailwind
 * ne peut pas voir : aucune de ces classes n'existait dans le CSS produit, et
 * les icônes étaient rendues sans couleur depuis le début.
 */

const facets = [
  {
    icon: Mic2,
    title: 'Nyla Vey',
    description:
      'The permanent voice of the solo work — intimacy, seduction and controlled intensity, not a guest feature.',
    card: 'hover:bg-neon-magenta/5 hover:glow-magenta',
    chip: 'bg-neon-magenta/10 border-neon-magenta/30 group-hover:bg-neon-magenta/20',
    icon_color: 'text-neon-magenta',
  },
  {
    icon: Users,
    title: 'Broken Shaman',
    description:
      'Two collaborative albums where electronic architecture meets fractured hip-hop and urban soul.',
    card: 'hover:bg-neon-cyan/5 hover:glow-cyan',
    chip: 'bg-neon-cyan/10 border-neon-cyan/30 group-hover:bg-neon-cyan/20',
    icon_color: 'text-neon-cyan',
  },
  {
    icon: Disc3,
    title: 'Producing others',
    description:
      "Hollow Static's debut album, and further passages into darker club territory with Chromabone.",
    card: 'hover:bg-neon-violet/5 hover:glow-violet',
    chip: 'bg-neon-violet/10 border-neon-violet/30 group-hover:bg-neon-violet/20',
    icon_color: 'text-neon-violet',
  },
  {
    icon: Compass,
    title: 'Kinetic Distro',
    description:
      'Artistic director of the label — connecting artists, records and visual identities into one universe.',
    card: 'hover:bg-neon-orange/5 hover:glow-orange',
    chip: 'bg-neon-orange/10 border-neon-orange/30 group-hover:bg-neon-orange/20',
    icon_color: 'text-neon-orange',
  },
];

/**
 * La biographie, en paragraphes.
 *
 * Un tableau plutôt qu'un bloc de JSX : le texte se relit et se remplace sans
 * traverser le balisage, et les paragraphes restent des paragraphes plutôt
 * qu'un `<p>` unique coupé par des `<br/>`.
 */
const biography = [
  'Grafenberg has never followed a straight line.',
  'The story began behind the decks in the 1990s, in a culture where music was discovered physically, built through instinct and tested directly against a moving crowd. Long before algorithms began defining taste, Grafenberg learned how rhythm could alter a room, how tension could be sustained and how a single transition could open the door to another world.',
  'In the early 2000s, Grafenberg released a series of electronic EPs through the Traumwelten label. These first recordings established the foundations of an artistic language already driven by atmosphere, movement and emotional contrast.',
  'Grafenberg re-emerged in the 2020s not as a nostalgia project, but as a producer, composer and world-builder without borders.',
  'Across eight solo albums, the project has continuously evolved, moving through French touch, synthwave, cosmic disco, cinematic electronica, alternative pop and darker forms of club music. Genres are treated as raw materials rather than boundaries. Analog warmth can collide with digital tension. A euphoric bassline can carry a trace of melancholy. A dance track can become a scene from a film that has never existed.',
  'At the heart of Grafenberg’s solo work stands Nyla Vey, the project’s permanent singer and privileged collaborator. Her voice gives a human presence to Grafenberg’s shifting electronic landscapes, moving between intimacy, seduction, vulnerability and controlled intensity. She is not simply a featured vocalist, but an essential part of the project’s identity.',
  'Grafenberg’s universe extends far beyond the solo discography. Two collaborative albums with Broken Shaman brought electronic architecture into contact with fractured hip-hop, cinematic production and urban soul. Grafenberg also produced the debut album by Hollow Static, helping to shape its world of impossible memories, emotional distortion and invented lives. Collaborations with Chromabone have opened further passages into darker club environments, corrupted signals and radical reinterpretations.',
  'As artistic director and mastermind of Kinetic Distro, Grafenberg connects artists, records, characters and visual identities into a constantly expanding creative universe. The role is not merely to produce music, but to recognise what each project could become and help it find its own language.',
  'Yet behind the producer, the curator and the architect, Grafenberg remains an artist first. A music lover still driven by the same impulse that existed behind the decks in the 1990s: the search for the next sound, the next emotion and the next door waiting to be opened.',
];

const Artist = () => (
  <section id="artist" className="relative px-6 py-24">
    <div className="from-deep via-surface/10 to-deep absolute inset-0 bg-gradient-to-b" />

    <div data-reveal className="relative z-10 container mx-auto max-w-6xl">
      <div className="mb-16 text-center">
        <p className="text-neon-cyan font-orbitron mb-4 text-sm uppercase tracking-[0.3em]">
          From the DJ booths of the 1990s to the sonic worlds of the 2020s
        </p>
        <h2 className="font-orbitron text-gradient-neon mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
          The Artist
        </h2>
        <div className="waveform mx-auto max-w-xs" />
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[320px_1fr]">
        <div className="mx-auto w-full max-w-[320px]">
          <div className="glass hover:glow-cyan rounded-2xl p-3 transition-all duration-500">
            {/* Servi depuis public/brand/, encodé par `npm run assets`.
                Les dimensions sont celles du fichier — 4:3, et non le carré que
                je déclarais : le navigateur réservait une place carrée puis
                recevait une image plus plate, et la page sautait. */}
            <img
              src="/brand/portrait.webp"
              alt="Grafenberg"
              width={640}
              height={480}
              loading="lazy"
              className="w-full rounded-xl object-cover"
            />
          </div>
          <div className="mt-6 text-center">
            <h3 className="font-orbitron text-foreground text-2xl font-bold">Ludovic Debay</h3>
            <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest">
              alias Grafenberg
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {biography.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* La chute de la biographie, détachée du corps parce qu'elle est
              écrite comme une signature et non comme un paragraphe. */}
          <p className="font-orbitron text-gradient-cyber pt-2 text-xl font-bold leading-snug">
            Grafenberg does not simply release records.
            <br />
            Grafenberg builds worlds through sound.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="font-orbitron text-gradient-cyber mb-8 text-center text-2xl font-bold md:text-3xl">
          The wider universe
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {facets.map(({ icon: Icon, title, description, card, chip, icon_color }) => (
            <div
              key={title}
              className={`glass group rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 ${card}`}
            >
              <div className={`mb-4 w-fit rounded-lg border p-3 transition-colors duration-300 ${chip}`}>
                <Icon className={`h-6 w-6 ${icon_color}`} aria-hidden="true" />
              </div>
              <h4 className="font-orbitron text-foreground mb-2 text-lg font-bold">{title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="glass hover:glow-orange mx-auto max-w-2xl rounded-2xl p-8 transition-all duration-500">
          <h3 className="font-orbitron text-gradient-neon mb-4 text-2xl font-bold">
            Follow the journey
          </h3>
          <p className="text-muted-foreground mb-6 text-lg">
            New releases, collaborations and the label’s wider roster.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="glass border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover-glow-orange rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
            >
              Listening links
            </a>
            <a
              href={links.label}
              target="_blank"
              rel="noopener noreferrer"
              className="glass border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
            >
              Kinetic Distro
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Artist;
