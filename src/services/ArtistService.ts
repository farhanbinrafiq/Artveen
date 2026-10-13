/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artist, ArtistApplication } from '../types';
import { INITIAL_ARTISTS, INITIAL_APPLICATIONS } from '../data';
import { executeFetch } from './api';

export class ArtistService {
  /**
   * Fetch all registered artists in the ecosystem
   */
  static async getArtists(): Promise<Artist[]> {
    const response = await executeFetch<Artist[]>('/artists', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_artists');
        return saved ? JSON.parse(saved) : INITIAL_ARTISTS;
      }
    });
    return response.data;
  }

  /**
   * Fetch single artist details by unique ID
   */
  static async getArtistById(id: string): Promise<Artist | null> {
    const artists = await this.getArtists();
    return artists.find(a => a.id === id) || null;
  }

  /**
   * Fetch single artist details by Slug (for dynamic routing)
   */
  static async getArtistBySlug(slug: string): Promise<Artist | null> {
    const artists = await this.getArtists();
    return artists.find(a => a.slug === slug) || null;
  }

  /**
   * Create or update an artist registry entry (CMS context)
   */
  static async saveArtist(artist: Artist): Promise<Artist> {
    const response = await executeFetch<Artist>(`/artists/${artist.id}`, {
      method: 'POST',
      body: artist,
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_artists');
        const list: Artist[] = current ? JSON.parse(current) : INITIAL_ARTISTS;
        const existsIdx = list.findIndex(a => a.id === artist.id);
        
        if (existsIdx > -1) {
          list[existsIdx] = artist;
        } else {
          list.push(artist);
        }
        localStorage.setItem('art_escape_artists', JSON.stringify(list));
        return artist;
      }
    });
    return response.data;
  }

  /**
   * Delete an artist from the ecosystem
   */
  static async deleteArtist(id: string): Promise<boolean> {
    const response = await executeFetch<boolean>(`/artists/${id}`, {
      method: 'DELETE',
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_artists');
        const list: Artist[] = current ? JSON.parse(current) : INITIAL_ARTISTS;
        const filtered = list.filter(a => a.id !== id);
        localStorage.setItem('art_escape_artists', JSON.stringify(filtered));
        return true;
      }
    });
    return response.data;
  }

  /**
   * Fetch guest artist applications
   */
  static async getApplications(): Promise<ArtistApplication[]> {
    const response = await executeFetch<ArtistApplication[]>('/applications', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_applications');
        return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
      }
    });
    return response.data;
  }

  /**
   * Submit an independent exhibitor application
   */
  static async submitApplication(app: Omit<ArtistApplication, 'id' | 'status' | 'date'>): Promise<ArtistApplication> {
    const response = await executeFetch<ArtistApplication>('/applications', {
      method: 'POST',
      body: app,
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_applications');
        const list: ArtistApplication[] = saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
        const newApp: ArtistApplication = {
          ...app,
          id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Pending',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        localStorage.setItem('art_escape_applications', JSON.stringify([newApp, ...list]));
        return newApp;
      }
    });
    return response.data;
  }

  /**
   * Update status of an application (Approve / Decline)
   */
  static async updateApplicationStatus(id: string, status: ArtistApplication['status']): Promise<ArtistApplication | null> {
    const response = await executeFetch<ArtistApplication | null>(`/applications/${id}/status`, {
      method: 'PUT',
      body: { status },
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_applications');
        const list: ArtistApplication[] = saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) return null;

        const updated = { ...list[idx], status };
        list[idx] = updated;
        localStorage.setItem('art_escape_applications', JSON.stringify(list));

        // Side effect: If Approved, register as guest artist
        if (status === 'Approved') {
          const currentArtists = localStorage.getItem('art_escape_artists');
          const artistsList: Artist[] = currentArtists ? JSON.parse(currentArtists) : INITIAL_ARTISTS;
          const artistId = `artist-${updated.name.toLowerCase().replace(/\s+/g, '-')}`;
          
          if (!artistsList.some(a => a.id === artistId)) {
            const newArtist: Artist = {
              id: artistId,
              name: updated.name,
              slug: updated.name.toLowerCase().replace(/\s+/g, '-'),
              role: 'Guest Artist',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
              bio: `${updated.name} is an approved Guest Artist specializing in ${updated.mediums.join(', ')}.`,
              story: updated.statement,
              verified: true,
              location: 'Bangladesh',
              featured: false,
              socials: {},
              earnings: 0,
              commissionEnabled: true
            };
            artistsList.push(newArtist);
            localStorage.setItem('art_escape_artists', JSON.stringify(artistsList));
          }
        }
        return updated;
      }
    });
    return response.data;
  }
}
