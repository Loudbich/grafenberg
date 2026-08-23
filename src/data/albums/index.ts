// Album data exports
import type { Album, Track, StreamingLinks } from '../types';

// Import album JSON data
import noSaintsNoProofData from './no-saints-no-proof.json';
import theErrorGospelData from './the-error-gospel.json';

// Type assertion for imported JSON
export const noSaintsNoProof: Album = noSaintsNoProofData as Album;
export const theErrorGospel: Album = theErrorGospelData as Album;

// All albums
export const albums: Album[] = [noSaintsNoProof, theErrorGospel];

// Get album by ID
export function getAlbumById(id: string): Album | undefined {
  return albums.find(album => album.id === id);
}

// Get all albums
export function getAllAlbums(): Album[] {
  return albums;
}

export type { Album, Track, StreamingLinks };
