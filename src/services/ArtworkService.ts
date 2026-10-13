/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artwork } from '../types';
import { INITIAL_ARTWORKS } from '../data';
import { executeFetch } from './api';

export class ArtworkService {
  /**
   * Fetch all artworks from the repository
   */
  static async getArtworks(): Promise<Artwork[]> {
    const response = await executeFetch<Artwork[]>('/artworks', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_artworks');
        return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
      }
    });
    return response.data;
  }

  /**
   * Fetch a single artwork by ID
   */
  static async getArtworkById(id: string): Promise<Artwork | null> {
    const artworks = await this.getArtworks();
    return artworks.find(a => a.id === id) || null;
  }

  /**
   * Fetch artworks filtered by theme category, medium, orientation, etc.
   */
  static async getFilteredArtworks(filters: {
    theme?: string;
    medium?: string;
    orientation?: string;
    priceMin?: number;
    priceMax?: number;
    artistId?: string;
    isSold?: boolean;
    collectionId?: string;
    searchQuery?: string;
  }): Promise<Artwork[]> {
    const list = await this.getArtworks();
    return list.filter(art => {
      if (filters.theme && art.theme !== filters.theme) return false;
      if (filters.medium && !art.medium.toLowerCase().includes(filters.medium.toLowerCase())) return false;
      if (filters.orientation && art.orientation !== filters.orientation) return false;
      if (filters.priceMin !== undefined && art.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && art.price > filters.priceMax) return false;
      if (filters.artistId && art.artistId !== filters.artistId) return false;
      if (filters.isSold !== undefined && art.isSold !== filters.isSold) return false;
      if (filters.collectionId && art.collectionId !== filters.collectionId) return false;
      
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchDesc = art.description.toLowerCase().includes(q);
        const matchMedium = art.medium.toLowerCase().includes(q);
        const matchTheme = art.theme.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchMedium && !matchTheme) return false;
      }
      
      return true;
    });
  }

  /**
   * Fetch featured original artworks
   */
  static async getFeaturedArtworks(): Promise<Artwork[]> {
    const list = await this.getArtworks();
    return list.filter(a => a.featured);
  }

  /**
   * Fetch artworks belonging to a specific collection
   */
  static async getArtworksByCollection(collectionId: string): Promise<Artwork[]> {
    const list = await this.getArtworks();
    return list.filter(a => a.collectionId === collectionId);
  }

  /**
   * Fetch artworks created by a specific artist
   */
  static async getArtworksByArtist(artistId: string): Promise<Artwork[]> {
    const list = await this.getArtworks();
    return list.filter(a => a.artistId === artistId);
  }

  /**
   * Create or update artwork details (CMS context)
   */
  static async saveArtwork(artwork: Artwork): Promise<Artwork> {
    const response = await executeFetch<Artwork>(`/artworks/${artwork.id}`, {
      method: 'POST',
      body: artwork,
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_artworks');
        const list: Artwork[] = current ? JSON.parse(current) : INITIAL_ARTWORKS;
        const existsIdx = list.findIndex(a => a.id === artwork.id);

        if (existsIdx > -1) {
          list[existsIdx] = artwork;
        } else {
          list.push(artwork);
        }
        localStorage.setItem('art_escape_artworks', JSON.stringify(list));
        return artwork;
      }
    });
    return response.data;
  }

  /**
   * Delete an artwork from the gallery
   */
  static async deleteArtwork(id: string): Promise<boolean> {
    const response = await executeFetch<boolean>(`/artworks/${id}`, {
      method: 'DELETE',
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_artworks');
        const list: Artwork[] = current ? JSON.parse(current) : INITIAL_ARTWORKS;
        const filtered = list.filter(a => a.id !== id);
        localStorage.setItem('art_escape_artworks', JSON.stringify(filtered));
        return true;
      }
    });
    return response.data;
  }
}
