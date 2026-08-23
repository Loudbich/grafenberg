import { Music, Youtube, Headphones } from 'lucide-react';

const TheErrorGospelContact = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-black to-neutral-950">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 60%)`,
      }} />
      
      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        {/* Section Header */}
        <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
          Connect
        </h2>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8" />
        
        <p className="text-xl text-amber-200/60 mb-12 max-w-2xl mx-auto">
          Follow Grafenberg for updates on new transmissions, live performances, and exclusive content.
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="https://grafenberg.bandcamp.com/album/the-error-gospel"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black/40 border border-amber-500/30 px-5 py-3 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Music className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-200 group-hover:text-amber-100 text-sm">Bandcamp</span>
          </a>
          
          <a
            href="https://open.spotify.com/intl-fr/album/3qVJ5DKNUxGIkeIjgLXZQW"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black/40 border border-amber-500/30 px-5 py-3 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Music className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-200 group-hover:text-amber-100 text-sm">Spotify</span>
          </a>

          <a
            href="https://www.youtube.com/channel/UCBaBFDyKqqHYNSDgfjpQzxg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black/40 border border-amber-500/30 px-5 py-3 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Youtube className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-200 group-hover:text-amber-100 text-sm">YouTube</span>
          </a>

          <a
            href="https://soundcloud.com/grafenbergmusik/sets/the-error-gospel"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black/40 border border-amber-500/30 px-5 py-3 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Headphones className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-200 group-hover:text-amber-100 text-sm">SoundCloud</span>
          </a>
          
          <a
            href="https://music.apple.com/album/the-error-gospel/1814SEP202"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black/40 border border-amber-500/30 px-5 py-3 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
          >
            <Music className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-200 group-hover:text-amber-100 text-sm">Apple Music</span>
          </a>
        </div>

        {/* Closing Statement */}
        <div className="inline-block p-6 bg-black/30 border border-amber-500/20 rounded-2xl">
          <p className="text-amber-400/80 italic font-medium">
            "There are no saints here, only signals. No proof, only persistence."
          </p>
        </div>
      </div>
    </section>
  );
};

export default TheErrorGospelContact;
