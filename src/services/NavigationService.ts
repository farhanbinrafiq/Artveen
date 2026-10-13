/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NavLink {
  label: string;
  route: string;
  id: string;
  badge?: string;
}

export class NavigationService {
  /**
   * Fetch core links for the top navigation bar
   */
  static getPrimaryLinks(): NavLink[] {
    return [
      { id: 'lnk-home', label: '01 / Vernissage', route: 'home' },
      { id: 'lnk-shop', label: '02 / Acquisitions', route: 'shop' },
      { id: 'lnk-collections', label: '03 / Curation Rooms', route: 'collections' },
      { id: 'lnk-portfolio', label: '04 / Portfolio Study', route: 'portfolio' },
      { id: 'lnk-journal', label: '05 / Studio Logs', route: 'journal' },
    ];
  }

  /**
   * Fetch links specifically for footer navigation blocks
   */
  static getFooterLinks(): Record<string, NavLink[]> {
    return {
      gallery: [
        { id: 'flnk-home', label: 'The Vernissage', route: 'home' },
        { id: 'flnk-shop', label: 'Original Paintings', route: 'shop' },
        { id: 'flnk-collections', label: 'Curated Series', route: 'collections' },
        { id: 'flnk-portfolio', label: 'Artist Biography', route: 'portfolio' },
      ],
      patrons: [
        { id: 'flnk-portal', label: 'Collector Portal', route: 'portal' },
        { id: 'flnk-cms', label: 'Curatorial Desk (CMS)', route: 'cms' },
        { id: 'flnk-terms', label: 'Acquisition Terms', route: 'terms' },
        { id: 'flnk-privacy', label: 'Privacy Protocol', route: 'privacy' },
      ]
    };
  }

  /**
   * Resolve simple breadcrumbs for nested routes (e.g. Artwork details or Collection details)
   */
  static getBreadcrumbs(route: string, context?: { title?: string }): { label: string; route: string }[] {
    const crumbs = [{ label: 'Sanctuary', route: 'home' }];
    
    if (route === 'artwork-detail') {
      crumbs.push({ label: 'Original Artworks', route: 'shop' });
      crumbs.push({ label: context?.title || 'Canvas Study', route: 'artwork-detail' });
    } else if (route === 'collection-detail') {
      crumbs.push({ label: 'Curated Rooms', route: 'collections' });
      crumbs.push({ label: context?.title || 'Collection Series', route: 'collection-detail' });
    } else if (route === 'journal-detail') {
      crumbs.push({ label: 'Studio Logs', route: 'journal' });
      crumbs.push({ label: context?.title || 'Chronicle Detail', route: 'journal-detail' });
    } else if (route !== 'home') {
      crumbs.push({ label: route.toUpperCase(), route });
    }

    return crumbs;
  }
}
