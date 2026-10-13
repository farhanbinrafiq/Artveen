/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Collection } from '../types';
import { INITIAL_COLLECTIONS } from '../data';
import { executeFetch } from './api';

export class CollectionService {
  /**
   * Fetch all collections in the repository
   */
  static async getCollections(): Promise<Collection[]> {
    const response = await executeFetch<Collection[]>('/collections', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_collections');
        return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
      }
    });
    return response.data;
  }

  /**
   * Fetch a single collection by ID
   */
  static async getCollectionById(id: string): Promise<Collection | null> {
    const collections = await this.getCollections();
    return collections.find(c => c.id === id) || null;
  }

  /**
   * Fetch featured collections for showcase
   */
  static async getFeaturedCollections(): Promise<Collection[]> {
    const list = await this.getCollections();
    return list.filter(c => c.featured);
  }

  /**
   * Save a collection details (Curator / Artist CMS)
   */
  static async saveCollection(collection: Collection): Promise<Collection> {
    const response = await executeFetch<Collection>(`/collections/${collection.id}`, {
      method: 'POST',
      body: collection,
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_collections');
        const list: Collection[] = current ? JSON.parse(current) : INITIAL_COLLECTIONS;
        const existsIdx = list.findIndex(c => c.id === collection.id);

        if (existsIdx > -1) {
          list[existsIdx] = collection;
        } else {
          list.push(collection);
        }
        localStorage.setItem('art_escape_collections', JSON.stringify(list));
        return collection;
      }
    });
    return response.data;
  }

  /**
   * Delete a collection from the ecosystem
   */
  static async deleteCollection(id: string): Promise<boolean> {
    const response = await executeFetch<boolean>(`/collections/${id}`, {
      method: 'DELETE',
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_collections');
        const list: Collection[] = current ? JSON.parse(current) : INITIAL_COLLECTIONS;
        const filtered = list.filter(c => c.id !== id);
        localStorage.setItem('art_escape_collections', JSON.stringify(filtered));
        return true;
      }
    });
    return response.data;
  }
}
