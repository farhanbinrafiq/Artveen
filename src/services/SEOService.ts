/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

export class SEOService {
  /**
   * Dynamically apply metadata elements into the index head document
   */
  static applyMetadata(meta: SEOMetadata): void {
    if (typeof document === 'undefined') return;

    // 1. Title
    document.title = meta.title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description & Keywords
    setMetaTag('name', 'description', meta.description);
    if (meta.keywords && meta.keywords.length) {
      setMetaTag('name', 'keywords', meta.keywords.join(', '));
    }

    // Open Graph standard properties
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:type', meta.ogType || 'website');
    if (meta.ogImage) {
      setMetaTag('property', 'og:image', meta.ogImage);
    }

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);
    if (meta.ogImage) {
      setMetaTag('name', 'twitter:image', meta.ogImage);
    }

    // Canonical link tag
    if (meta.canonicalUrl) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', meta.canonicalUrl);
    }

    // Dynamic JSON-LD structured data schema injections
    let script: HTMLScriptElement | null = document.getElementById('seo-jsonld-schema') as HTMLScriptElement | null;
    if (meta.structuredData) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-jsonld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(meta.structuredData, null, 2);
    } else {
      if (script) {
        script.remove();
      }
    }
  }

  /**
   * Helper to generate dynamic JSON-LD Structured Schema for a single artwork item
   */
  static generateArtworkSchema(artwork: {
    title: string;
    description: string;
    image: string;
    price: number;
    year: string;
    artistName: string;
    medium: string;
  }): Record<string, any> {
    return {
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      "name": artwork.title,
      "image": artwork.image,
      "description": artwork.description,
      "dateCreated": artwork.year,
      "artMedium": artwork.medium,
      "creator": {
        "@type": "Person",
        "name": artwork.artistName
      },
      "offers": {
        "@type": "Offer",
        "price": artwork.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    };
  }
}
