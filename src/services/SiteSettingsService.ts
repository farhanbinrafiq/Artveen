/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeFetch } from './api';
import { SiteSettings, DEFAULT_SITE_SETTINGS, FeatureFlags, DEFAULT_FEATURE_FLAGS } from './config';

export class SiteSettingsService {
  /**
   * Fetch active site configuration details (Announcements, Currency, Contact coordinates)
   */
  static async getSettings(): Promise<SiteSettings> {
    const response = await executeFetch<SiteSettings>('/settings', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_site_settings');
        return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
      }
    });
    return response.data;
  }

  /**
   * Save dynamic global settings from the Curatorial Desk
   */
  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    const response = await executeFetch<SiteSettings>('/settings', {
      method: 'POST',
      body: settings,
      mockFallback: () => {
        localStorage.setItem('art_escape_site_settings', JSON.stringify(settings));
        return settings;
      }
    });
    return response.data;
  }

  /**
   * Get active feature flags in the frontend application
   */
  static getFeatureFlags(): FeatureFlags {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('art_escape_feature_flags');
      return saved ? JSON.parse(saved) : DEFAULT_FEATURE_FLAGS;
    }
    return DEFAULT_FEATURE_FLAGS;
  }

  /**
   * Save/Toggle feature flags for development verification
   */
  static saveFeatureFlags(flags: FeatureFlags): FeatureFlags {
    if (typeof window !== 'undefined') {
      localStorage.setItem('art_escape_feature_flags', JSON.stringify(flags));
    }
    return flags;
  }
}
