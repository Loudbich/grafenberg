// Types for album data

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  deezer?: string;
  bandcamp?: string;
  amazonMusic?: string;
  qobuz?: string;
  soundcloud?: string;
}

export interface Track {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  preview_url: string;
  image: string;
  description?: string;
  lyrics?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  artwork: string;
  backgroundImage: string;
  vinylUrl?: string;
  streamingLinks: StreamingLinks;
  tracks: Track[];
  theme: 'neon' | 'amber'; // Color theme for the album page
}
