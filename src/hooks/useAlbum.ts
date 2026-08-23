import { useMemo, useCallback, useState, useEffect } from 'react';
import { getAlbumById, getAllAlbums, type Album } from '@/data/albums';
import { getStoredAlbum, getStoredAlbums, saveAlbum } from '@/data/storage';

// Hook to get a specific album by ID (checks localStorage first)
export function useAlbum(albumId: string): Album | undefined {
  const [album, setAlbum] = useState<Album | undefined>(() => {
    // Check localStorage first
    const stored = getStoredAlbum(albumId);
    if (stored) return stored;
    // Fall back to JSON data
    return getAlbumById(albumId);
  });

  useEffect(() => {
    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      const stored = getStoredAlbum(albumId);
      if (stored) {
        setAlbum(stored);
      } else {
        setAlbum(getAlbumById(albumId));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [albumId]);

  return album;
}

// Hook to get all albums (checks localStorage first)
export function useAlbums(): Album[] {
  const [albums, setAlbums] = useState<Album[]>(() => {
    const stored = getStoredAlbums();
    const jsonAlbums = getAllAlbums();
    
    if (stored) {
      // Merge stored albums with JSON albums (stored takes priority)
      return jsonAlbums.map(album => stored[album.id] || album);
    }
    return jsonAlbums;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = getStoredAlbums();
      const jsonAlbums = getAllAlbums();
      
      if (stored) {
        setAlbums(jsonAlbums.map(album => stored[album.id] || album));
      } else {
        setAlbums(jsonAlbums);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return albums;
}

// Hook for editing albums (with save functionality)
export function useAlbumEditor(albumId: string) {
  const [album, setAlbum] = useState<Album | undefined>(() => {
    const stored = getStoredAlbum(albumId);
    if (stored) return stored;
    return getAlbumById(albumId);
  });

  const updateAlbum = useCallback((updates: Partial<Album>) => {
    if (!album) return;
    const updated = { ...album, ...updates };
    setAlbum(updated);
  }, [album]);

  const updateStreamingLink = useCallback((platform: string, url: string) => {
    if (!album) return;
    const updated = {
      ...album,
      streamingLinks: {
        ...album.streamingLinks,
        [platform]: url
      }
    };
    setAlbum(updated);
  }, [album]);

  const updateTrack = useCallback((trackId: string, updates: Partial<Album['tracks'][0]>) => {
    if (!album) return;
    const updated = {
      ...album,
      tracks: album.tracks.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    };
    setAlbum(updated);
  }, [album]);

  const addTrack = useCallback((track: Album['tracks'][0]) => {
    if (!album) return;
    const updated = {
      ...album,
      tracks: [...album.tracks, track]
    };
    setAlbum(updated);
  }, [album]);

  const removeTrack = useCallback((trackId: string) => {
    if (!album) return;
    const updated = {
      ...album,
      tracks: album.tracks.filter(track => track.id !== trackId)
    };
    setAlbum(updated);
  }, [album]);

  const save = useCallback(() => {
    if (album) {
      saveAlbum(album);
      // Dispatch custom event to notify other hooks
      window.dispatchEvent(new Event('storage'));
    }
  }, [album]);

  const reset = useCallback(() => {
    const original = getAlbumById(albumId);
    setAlbum(original);
  }, [albumId]);

  return {
    album,
    updateAlbum,
    updateStreamingLink,
    updateTrack,
    addTrack,
    removeTrack,
    save,
    reset
  };
}

// Helper to resolve asset paths for images
export function resolveAssetPath(path: string): string {
  if (!path) return '';
  return path;
}

// Helper to get streaming platform display info
export function getStreamingPlatformInfo(platformKey: string) {
  const platforms: Record<string, { name: string; color: string }> = {
    spotify: { name: 'Spotify', color: 'hover-glow-orange' },
    appleMusic: { name: 'Apple Music', color: 'hover-glow-cyan' },
    deezer: { name: 'Deezer', color: 'hover-glow-magenta' },
    bandcamp: { name: 'Bandcamp', color: 'hover-glow-violet' },
    amazonMusic: { name: 'Amazon Music', color: 'hover-glow-cyan' },
    qobuz: { name: 'Qobuz', color: 'hover-glow-orange' },
    soundcloud: { name: 'SoundCloud', color: 'hover-glow-orange' },
  };
  
  return platforms[platformKey] || { name: platformKey, color: 'hover-glow-cyan' };
}
