import React from 'react';
import { Button } from '@/components/ui/button';
import { Music2, Zap, Headphones, Star } from 'lucide-react';
import portrait from '@/assets/PP.png';

const Artist = () => {
  const highlights = [
    {
      icon: Music2,
      title: 'Electronic Producer',
      description: 'Creating immersive synthwave soundscapes',
      color: "neon-orange",
      glow: "glow-orange"
    },
    {
      icon: Zap,
      title: 'Sound Designer',
      description: 'Crafting unique digital atmospheres',
      color: "neon-cyan",
      glow: "glow-cyan"
    },
    {
      icon: Headphones,
      title: 'Mixing Engineer',
      description: 'Precision audio engineering and mastering',
      color: "neon-magenta",
      glow: "glow-magenta"
    },
    {
      icon: Star,
      title: 'Creative Vision',
      description: 'Blending retro aesthetics with modern production',
      color: "neon-violet",
      glow: "glow-violet"
    }
  ];

  return (
    <section id="artist" className="relative py-24 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-surface/10 to-deep" />
      
      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-cyber">
            The Artist
          </h2>
          <div className="waveform max-w-xs mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the creative mind behind the synthwave experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Artist Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="glass rounded-2xl p-4 hover:glow-violet transition-all duration-500">
                <img 
                  src={portrait}
                  alt="Ludovic Debay - Grafenberg" 
                  className="w-full h-auto rounded-xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent rounded-2xl pointer-events-none" />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-cyan/20 rounded-full blur-sm animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-neon-orange/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Artist Info */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="glass rounded-2xl p-8 hover:glow-cyan transition-all duration-500">
              <h3 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 text-gradient-neon">
                Ludovic Debay
              </h3>
              <p className="text-lg text-neon-cyan mb-6 font-medium">
                Alias <span className="text-neon-orange">GRAFENBERG</span>
              </p>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Grafenberg is a sonic explorer whose path spans from the DJ booth to the edges of contemporary electronic production. After two decades of collecting and spinning techno, minimal and deep underground records, he transformed that passion into a personal language of textures and contrasts.
                </p>
                <p>
                  His debut EP on Traumwelten was both a tribute to the artists who shaped him and a declaration of his own voice. Since then, Grafenberg has expanded his sound, weaving deep techno foundations with cinematic atmospheres, hypnotic grooves, and moog-driven nostalgia.
                </p>
                <p>
                  In 2025, Grafenberg released “No Saints, No Proof”, an album that pushes his music into new emotional and conceptual territory—blurring the line between the dancefloor and inner reflection. Looking ahead, his upcoming project “Erebion’s Dominion” promises to further expand this vision, unfolding as a narrative between cosmic darkness and redemptive light.
                </p>
                <p>
                  Forever chasing innovation and raw emotion, Grafenberg bridges the legacy of techno with new horizons, where every note tells a fragment of dream or utopia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="mt-16">
          <h3 className="font-orbitron font-bold text-2xl md:text-3xl mb-8 text-center text-gradient-cyber">
            Expertise & Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <div
                  key={index}
                  className={`glass rounded-xl p-6 transition-all duration-500 transform hover:-translate-y-2 group ${
                    highlight.color === 'neon-orange' ? 'hover:bg-neon-orange/5 hover:glow-orange' :
                    highlight.color === 'neon-cyan' ? 'hover:bg-neon-cyan/5 hover:glow-cyan' :
                    highlight.color === 'neon-magenta' ? 'hover:bg-neon-magenta/5 hover:glow-magenta' :
                    'hover:bg-neon-violet/5 hover:glow-violet'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-${highlight.color}/10 border border-${highlight.color}/30 rounded-lg group-hover:bg-${highlight.color}/20 transition-colors duration-300`}>
                      <IconComponent className={`w-6 h-6 text-${highlight.color}`} />
                    </div>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-foreground group-hover:text-white transition-colors duration-300 mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-muted-foreground group-hover:text-foreground/90 text-sm leading-relaxed transition-colors duration-300">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto hover:glow-orange transition-all duration-500">
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-gradient-neon">
              Connect and follow the journey
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Follow the creative process and discover new releases
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="glass px-6 py-3 rounded-xl border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover-glow-orange transition-all duration-300 font-semibold"
              >
                <Music2 className="w-5 h-5 inline mr-2" />
                Follow on Platforms
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Artist;