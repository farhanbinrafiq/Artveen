/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class MediaService {
  /**
   * Safe image source loader with automatic fallback placeholders
   */
  static getOptimizedUrl(src: string | undefined, size: 'thumbnail' | 'medium' | 'large' | 'banner' = 'medium'): string {
    if (!src) {
      return 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800';
    }

    // If it's already an Unsplash or external full URL, let's optimize the width/fit parameters
    if (src.includes('unsplash.com')) {
      const url = new URL(src);
      // Clean existing sizing queries to avoid collisions
      url.searchParams.delete('w');
      url.searchParams.delete('h');
      url.searchParams.delete('q');

      const width = size === 'thumbnail' ? 150 : size === 'medium' ? 600 : size === 'large' ? 1200 : 1920;
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', '80');
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }

    return src;
  }

  /**
   * Pre-fetch list of images for lightning-fast transitions
   */
  static prefetchImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = this.getOptimizedUrl(url, 'medium');
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Gracefully proceed on load fail
        });
      })
    );
  }
}
