/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DataSourceType = 'mock' | 'rest' | 'graphql';

export interface FeatureFlags {
  enableGuestArtists: boolean;
  enableArtistDirectory: boolean;
  enableExhibitions: boolean;
  enableEvents: boolean;
  enableCollectorPortal: boolean;
  enableMembership: boolean;
  enableWorkshops: boolean;
  enableMarketplace: boolean;
  enableDigitalDownloads: boolean;
}

export interface PageHeroConfig {
  height: 'small' | 'medium' | 'large' | 'fullscreen';
  backgroundStyle: 'white' | 'mist' | 'dark' | 'gradient';
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export interface SectionConfig {
  visible: boolean;
  title: string;
  subtitle?: string;
  backgroundStyle: 'white' | 'mist' | 'dark';
}

export interface PageConfig {
  hero: PageHeroConfig;
  sections: {
    [key: string]: SectionConfig;
  };
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  announcement?: {
    text: string;
    visible: boolean;
    link?: string;
  };
  contactEmail: string;
  currency: string;
  footerQuote: string;
  theme: {
    primaryColor: string;
    canvasBg: string;
    studioMist: string;
    carmine: string;
  };
}

// Global configurations with standard default fallbacks
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableGuestArtists: true, // Existing guest artists
  enableArtistDirectory: false, // Hidden pre-activation
  enableExhibitions: false,
  enableEvents: false,
  enableCollectorPortal: true, // Existing collector portal
  enableMembership: false,
  enableWorkshops: false,
  enableMarketplace: false,
  enableDigitalDownloads: false,
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Artveen",
  tagline: "Fine Art & High Tactility Editorial Sanctuary",
  announcement: {
    text: "New Vernissage: Discover 'Echoes of the Monsoon' exhibiting this summer.",
    visible: true,
  },
  contactEmail: "studio@artveen.com",
  currency: "USD",
  footerQuote: "Art is the materialization of silence, captured through water, earth, and crystal.",
  theme: {
    primaryColor: "#1C1C1C", // Charcoal Ink
    canvasBg: "#FFFAFA", // Canvas White
    studioMist: "#F0FFF0", // Studio Mist
    carmine: "#FF0038", // Signature Carmine
  }
};

// Default dynamic page layouts
export const DEFAULT_PAGE_CONFIGS: Record<string, PageConfig> = {
  home: {
    hero: {
      height: 'fullscreen',
      backgroundStyle: 'gradient',
      title: "Artveen",
      subtitle: "Materializing silence on raw canvas with sea salts, rainwater, and natural earth pigments.",
      ctaText: "Explore Collection",
      ctaLink: "shop"
    },
    sections: {
      livingGallery: { visible: true, title: "The Living Gallery", backgroundStyle: 'white' },
      featuredCollections: { visible: true, title: "Featured Collections", backgroundStyle: 'mist' },
      featuredOriginals: { visible: true, title: "Featured Originals", backgroundStyle: 'white' },
      editorsPicks: { visible: true, title: "Curated Selection", backgroundStyle: 'mist' },
      artistStory: { visible: true, title: "The Hand Behind the Canvas", backgroundStyle: 'white' },
      journalPreview: { visible: true, title: "From the Studio Logs", backgroundStyle: 'mist' },
      testimonials: { visible: true, title: "Collector Perspectives", backgroundStyle: 'white' }
    },
    seo: {
      title: "Artveen | Fine Tactile Painting Sanctuary",
      description: "Fine art portfolio and editorial gallery of artist Tanveen. Explore original sea-salt infused canvas paintings, local ocean art, and Sreemangal highlands sketches.",
      keywords: ["fine art", "tactile canvas", "sea salt painting", "Tanveen", "abstract art", "contemporary painting"]
    }
  },
  shop: {
    hero: {
      height: 'medium',
      backgroundStyle: 'mist',
      title: "The Exhibition & Shop Sanctuary",
      subtitle: "Secure original tactile canvases and numbered fine-art limited prints."
    },
    sections: {
      filterBar: { visible: true, title: "Filters", backgroundStyle: 'white' },
      artGrid: { visible: true, title: "Artworks", backgroundStyle: 'white' }
    },
    seo: {
      title: "Original Tactile Artworks & Prints | Artveen",
      description: "Secure original textured canvases and archival paper limited prints hand-signed by Tanveen. Global insured shipment.",
    }
  },
  journal: {
    hero: {
      height: 'small',
      backgroundStyle: 'dark',
      title: "The Studio Chronicles",
      subtitle: "Reflections on organic material harvesting, sea salt crystallization, and creative philosophies."
    },
    sections: {
      blogGrid: { visible: true, title: "Logs", backgroundStyle: 'white' }
    },
    seo: {
      title: "The Studio Chronicles | Artveen Journal",
      description: "Read about studio experiments on sea salt crystallization, rainwater painting techniques, and travelogues from Sreemangal tea estates.",
    }
  }
};
