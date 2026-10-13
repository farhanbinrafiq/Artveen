/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JournalPost } from '../types';
import { INITIAL_JOURNAL } from '../data';
import { executeFetch } from './api';

export class JournalService {
  /**
   * Fetch all journal stories/posts
   */
  static async getJournalPosts(): Promise<JournalPost[]> {
    const response = await executeFetch<JournalPost[]>('/journal', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_journal');
        return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
      }
    });
    return response.data;
  }

  /**
   * Fetch a single journal post by ID
   */
  static async getJournalPostById(id: string): Promise<JournalPost | null> {
    const list = await this.getJournalPosts();
    return list.find(p => p.id === id) || null;
  }

  /**
   * Fetch single post by Slug (for future dynamic routing)
   */
  static async getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
    const list = await this.getJournalPosts();
    // In our mock, let's treat the title lowercase with hyphens as slug
    return list.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === slug) || null;
  }

  /**
   * Fetch latest entries (for homepage layout previews)
   */
  static async getLatestJournalPosts(limit: number = 3): Promise<JournalPost[]> {
    const list = await this.getJournalPosts();
    return list.slice(0, limit);
  }

  /**
   * Create or update a journal entry
   */
  static async saveJournalPost(post: JournalPost): Promise<JournalPost> {
    const response = await executeFetch<JournalPost>(`/journal/${post.id}`, {
      method: 'POST',
      body: post,
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_journal');
        const list: JournalPost[] = current ? JSON.parse(current) : INITIAL_JOURNAL;
        const existsIdx = list.findIndex(p => p.id === post.id);

        if (existsIdx > -1) {
          list[existsIdx] = post;
        } else {
          list.push(post);
        }
        localStorage.setItem('art_escape_journal', JSON.stringify(list));
        return post;
      }
    });
    return response.data;
  }

  /**
   * Delete a journal post from repository
   */
  static async deleteJournalPost(id: string): Promise<boolean> {
    const response = await executeFetch<boolean>(`/journal/${id}`, {
      method: 'DELETE',
      mockFallback: () => {
        const current = localStorage.getItem('art_escape_journal');
        const list: JournalPost[] = current ? JSON.parse(current) : INITIAL_JOURNAL;
        const filtered = list.filter(p => p.id !== id);
        localStorage.setItem('art_escape_journal', JSON.stringify(filtered));
        return true;
      }
    });
    return response.data;
  }
}
