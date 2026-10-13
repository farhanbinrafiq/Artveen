/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimelineEvent } from '../types';
import { TIMELINE_EVENTS } from '../data';
import { executeFetch } from './api';

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  coverImage: string;
  isVirtual: boolean;
  featuredArtworkIds: string[];
}

export class ExhibitionService {
  /**
   * Fetch historical timeline and milestones
   */
  static async getTimelineEvents(): Promise<TimelineEvent[]> {
    const response = await executeFetch<TimelineEvent[]>('/timeline', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_timeline');
        return saved ? JSON.parse(saved) : TIMELINE_EVENTS;
      }
    });
    return response.data;
  }

  /**
   * Fetch current and upcoming exhibitions
   */
  static async getExhibitions(): Promise<Exhibition[]> {
    const response = await executeFetch<Exhibition[]>('/exhibitions', {
      mockFallback: () => {
        // Return standard list
        return [
          {
            id: 'ex-monsoon',
            title: "Echoes of the Monsoon",
            subtitle: "An immersive exploration of rainwater textures on organic linen.",
            description: "A solo vernissage exhibiting Tanveen's highly textural canvas studies harvesting natural monsoonal precipitation in the Sreemangal Highlands.",
            startDate: "July 1, 2026",
            endDate: "August 31, 2026",
            location: "Virtual Sanctuary & Studio Room, Sreemangal",
            coverImage: "/gallery/exhibition-wall-2.jpg",
            isVirtual: true,
            featuredArtworkIds: ['tanveen-canvas-01', 'tanveen-canvas-03']
          },
          {
            id: 'ex-salt',
            title: "Crystalline Silence",
            subtitle: "Salt crystallizations as co-creators of light and earth.",
            description: "A series illustrating original coastal canvas experiments using heavy sea-salt, thick modeling paste, and minerals of the Bay of Bengal.",
            startDate: "October 10, 2026",
            endDate: "November 20, 2026",
            location: "Marine Gallery, Chittagong & Virtual Sanctuary",
            coverImage: "/gallery/pair-installation.jpg",
            isVirtual: false,
            featuredArtworkIds: ['tanveen-canvas-02', 'tanveen-canvas-04']
          }
        ];
      }
    });
    return response.data;
  }
}
