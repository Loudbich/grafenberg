import { Music, Zap, Headphones, Radio, Disc, Volume2 } from 'lucide-react';

const TheErrorGospelHighlights = () => {
  const features = [
    {
      icon: Music,
      title: "Dark Electronic",
      description: "Post-industrial dance rhythms that pulse like worn machinery",
    },
    {
      icon: Zap,
      title: "Spectral Pop",
      description: "Voices appear as echoes — distant, half-remembered, transmitted through static",
    },
    {
      icon: Headphones,
      title: "Analog Decay",
      description: "Saturation, distortion, and lo-fi artifacts as narrative devices",
    },
    {
      icon: Radio,
      title: "Berlin Nights",
      description: "Late-night club sensibility woven with Anatolian melodic gravitas",
    },
    {
      icon: Disc,
      title: "Corrupted Liturgy",
      description: "Each track a verse in a fractured gospel where error replaces faith",
    },
    {
      icon: Volume2,
      title: "Hypnotic Insistence",
      description: "Rhythms move with persistence — club music for reflection",
    }
  ];

  return (
    <section id="highlights" className="relative py-24 px-6 bg-gradient-to-b from-neutral-950 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 50%),
                          radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)`,
      }} />
      
      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent leading-tight">
            Album Highlights
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
          <p className="text-xl text-amber-200/60 max-w-2xl mx-auto">
            Dive deep into the sonic landscape of "The Error Gospel" - 
            a transmission through dark electronic territories and spectral realms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-black/40 border border-amber-500/20 rounded-2xl p-8 group transition-all duration-500 transform hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className="inline-flex p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-amber-400" />
                </div>

                {/* Content */}
                <h3 className="font-orbitron font-bold text-xl mb-4 text-amber-200 group-hover:text-amber-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-amber-100/60 leading-relaxed group-hover:text-amber-100/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Decorative line */}
                <div className="w-full h-px bg-gradient-to-r from-amber-500/50 to-transparent mt-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-orbitron font-bold text-2xl mb-4 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Experience the Full EP
            </h3>
            <p className="text-amber-200/60 mb-6">
              This is not an album that explains itself. It transmits. It loops. It remains.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 border border-amber-500/30 px-6 py-3 rounded-xl text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 font-semibold"
              >
                Stream on Spotify
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 border border-amber-500/30 px-6 py-3 rounded-xl text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 font-semibold"
              >
                Buy on Bandcamp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheErrorGospelHighlights;
