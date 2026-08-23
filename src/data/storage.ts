// Storage utilities for album data persistence

import type { Album } from './types';

const STORAGE_KEY = 'grafenberg_albums';

// Get all albums from localStorage
export function getStoredAlbums(): Record<string, Album> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Get a specific album from localStorage
export function getStoredAlbum(albumId: string): Album | null {
  const albums = getStoredAlbums();
  return albums?.[albumId] || null;
}

// Save an album to localStorage
export function saveAlbum(album: Album): void {
  try {
    const albums = getStoredAlbums() || {};
    albums[album.id] = album;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Save all albums to localStorage
export function saveAllAlbums(albums: Record<string, Album>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Clear all stored albums (reset to JSON defaults)
export function clearStoredAlbums(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Export albums as JSON string for download
export function exportAlbumsAsJson(): string {
  const albums = getStoredAlbums();
  return JSON.stringify(albums, null, 2);
}
