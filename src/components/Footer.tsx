import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep to-surface/20" />
      
      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          {/* Brand */}
          <h3 className="font-display font-bold text-3xl text-gradient-neon mb-4">
            GRAFENBERG
          </h3>
          
          {/* Waveform */}
          <div className="waveform max-w-xs mx-auto mb-6" />
          
          
          {/* Hashtags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['#NewMusic', '#Synthwave', '#Darkwave'].map((tag) => (
              <span
                key={tag}
                className="glass px-3 py-1 rounded-full text-sm text-neon-cyan border border-neon-cyan/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} Grafenberg (Ludovic Debay). All rights reserved.
            </p>
            
            {/* Made with love */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-neon-magenta animate-pulse" />
              <span>in France</span>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground/70">
              Released by Kinetic Distro. Support independent electronic music.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;