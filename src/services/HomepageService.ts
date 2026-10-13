/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeFetch } from './api';
import { PageConfig, DEFAULT_PAGE_CONFIGS } from './config';
import { INITIAL_TESTIMONIALS } from '../data';
import { Testimonial } from '../types';

export interface HomepageAggregateData {
  config: PageConfig;
  editorialQuote: {
    text: string;
    author: string;
    role: string;
  };
  testimonials: Testimonial[];
}

export class HomepageService {
  /**
   * Fetch all CMS-driven layouts and testimonials for the homepage
   */
  static async getHomepageData(): Promise<HomepageAggregateData> {
    const response = await executeFetch<HomepageAggregateData>('/homepage', {
      mockFallback: () => {
        const savedConfig = localStorage.getItem('art_escape_page_config_home');
        const config: PageConfig = savedConfig ? JSON.parse(savedConfig) : DEFAULT_PAGE_CONFIGS.home;

        const savedTestimonials = localStorage.getItem('art_escape_testimonials');
        const testimonials: Testimonial[] = savedTestimonials ? JSON.parse(savedTestimonials) : INITIAL_TESTIMONIALS;

        return {
          config,
          editorialQuote: {
            text: "Each brushstroke is a meditation; a silent, material dialogue between rainwater, sea-salt crystal growth, and pure organic linen.",
            author: "Tanveen",
            role: "Principal Artist & Founder"
          },
          testimonials
        };
      }
    });
    return response.data;
  }

  /**
   * Update the dynamic home page configuration
   */
  static async saveHomepageConfig(config: PageConfig): Promise<PageConfig> {
    const response = await executeFetch<PageConfig>('/homepage/config', {
      method: 'POST',
      body: config,
      mockFallback: () => {
        localStorage.setItem('art_escape_page_config_home', JSON.stringify(config));
        return config;
      }
    });
    return response.data;
  }
}
