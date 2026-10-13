/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeFetch } from './api';

export interface FooterConfig {
  editorialQuote: string;
  copyright: string;
  address: string;
  socials: {
    instagram: string;
    pinterest: string;
    artsy?: string;
  };
}

export class FooterService {
  /**
   * Fetch footer configurations dynamically
   */
  static async getFooterConfig(): Promise<FooterConfig> {
    const response = await executeFetch<FooterConfig>('/footer', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_footer_config');
        return saved ? JSON.parse(saved) : {
          editorialQuote: "Each piece is a physical study in earth pigments, rainwater crystallization, and raw space.",
          copyright: `© ${new Date().getFullYear()} Tanveen's Art Escape. Crafted with premium high-tactility materials. All rights reserved.`,
          address: "The Highlands Studio, Sreemangal & Chittagong Coastal Sanctuary, Bangladesh",
          socials: {
            instagram: "https://instagram.com/tanveen.art",
            pinterest: "https://pinterest.com/tanveenart",
            artsy: "https://artsy.net/artist/tanveen"
          }
        };
      }
    });
    return response.data;
  }

  /**
   * Update the dynamic footer configuration (CMS context)
   */
  static async saveFooterConfig(config: FooterConfig): Promise<FooterConfig> {
    const response = await executeFetch<FooterConfig>('/footer', {
      method: 'POST',
      body: config,
      mockFallback: () => {
        localStorage.setItem('art_escape_footer_config', JSON.stringify(config));
        return config;
      }
    });
    return response.data;
  }
}
