/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artwork, Collection, JournalPost, Artist } from '../types';
import { ArtworkService } from './ArtworkService';
import { CollectionService } from './CollectionService';
import { JournalService } from './JournalService';
import { ArtistService } from './ArtistService';

export interface SearchResults {
  artworks: Artwork[];
  collections: Collection[];
  journalPosts: JournalPost[];
  artists: Artist[];
}

export class SearchService {
  /**
   * Search across all core entities in the ecosystem
   */
  static async searchEverything(query: string): Promise<SearchResults> {
    if (!query || !query.trim()) {
      return { artworks: [], collections: [], journalPosts: [], artists: [] };
    }

    const q = query.toLowerCase().trim();

    // Load concurrently from all services
    const [artworks, collections, journal, artists] = await Promise.all([
      ArtworkService.getArtworks(),
      CollectionService.getCollections(),
      JournalService.getJournalPosts(),
      ArtistService.getArtists()
    ]);

    // Apply strict tactile search filters
    const matchedArtworks = artworks.filter(art => 
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.medium.toLowerCase().includes(q) ||
      art.theme.toLowerCase().includes(q) ||
      (art.moodTags && art.moodTags.some(tag => tag.toLowerCase().includes(q))) ||
      (art.locationInspiration && art.locationInspiration.toLowerCase().includes(q))
    );

    const matchedCollections = collections.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.story.toLowerCase().includes(q)
    );

    const matchedJournal = journal.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchedArtists = artists.filter(a => 
      a.name.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q) ||
      a.story.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );

    return {
      artworks: matchedArtworks,
      collections: matchedCollections,
      journalPosts: matchedJournal,
      artists: matchedArtists
    };
  }
}
