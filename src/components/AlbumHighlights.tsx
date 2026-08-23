import { Music, Zap, Headphones, Radio, Disc, Volume2 } from 'lucide-react';

const AlbumHighlights = () => {
  const features = [
    {
      icon: Music,
      title: "Dark Synthwave",
      description: "Immersive soundscapes blending retro and futuristic elements",
      color: "neon-orange",
      glow: "glow-orange"
    },
    {
      icon: Zap,
      title: "Electronic Fusion",
      description: "Cutting-edge production with analog warmth and digital precision",
      color: "neon-cyan",
      glow: "glow-cyan"
    },
    {
      icon: Headphones,
      title: "Atmospheric Journey",
      description: "Each track crafted to transport listeners to cyberpunk realms",
      color: "neon-magenta",
      glow: "glow-magenta"
    },
    {
      icon: Radio,
      title: "Nostalgic Vibes",
      description: "80s-inspired melodies meet modern production techniques",
      color: "neon-violet",
      glow: "glow-violet"
    },
    {
      icon: Disc,
      title: "Epic Storytelling",
      description: "Musical narratives that explore themes of redemption and truth",
      color: "neon-cyan",
      glow: "glow-cyan"
    },
    {
      icon: Volume2,
      title: "Immersive Audio",
      description: "Mastered for maximum impact across all listening formats",
      color: "neon-orange",
      glow: "glow-orange"
    }
  ];

  return (
    <section id="highlights" className="relative py-24 px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/50 to-surface/30" />
      
      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-cyber leading-tight">
            Album Highlights
          </h2>
          <div className="waveform max-w-md mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive deep into the sonic landscape of "No Saints, No Proof" - 
            a journey through dark synthwave territories and electronic realms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`glass rounded-2xl p-8 group transition-all duration-500 transform hover:-translate-y-2 ${
                  feature.color === 'neon-orange' ? 'hover:bg-neon-orange/5 hover:glow-orange' :
                  feature.color === 'neon-cyan' ? 'hover:bg-neon-cyan/5 hover:glow-cyan' :
                  feature.color === 'neon-magenta' ? 'hover:bg-neon-magenta/5 hover:glow-magenta' :
                  'hover:bg-neon-violet/5 hover:glow-violet'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-${feature.color}/10 border border-${feature.color}/30 mb-6 group-hover:bg-${feature.color}/20 transition-colors duration-300`}>
                  <Icon className={`h-6 w-6 text-${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-orbitron font-bold text-xl mb-4 text-foreground group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Decorative Waveform */}
                <div className={`waveform mt-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300`} 
                     style={{
                       background: `linear-gradient(90deg, var(--${feature.color}) 0%, transparent 100%)`,
                       height: '1px'
                     }} 
                />
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-gradient-neon">
              Experience the Full Album
            </h3>
            <p className="text-muted-foreground mb-6">
              Don't miss any track from this cyberpunk masterpiece. 
              Stream the complete album now.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://open.spotify.com/intl-fr/album/1Rc7HhHY8dFrqlrQePv1TZ"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-6 py-3 rounded-xl border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover-glow-orange transition-all duration-300 font-semibold"
              >
                Stream on Spotify
              </a>
              <a
                href="https://grafenbergnoir.bandcamp.com/album/no-saints-no-proof"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-6 py-3 rounded-xl border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan transition-all duration-300 font-semibold"
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

export default AlbumHighlights;