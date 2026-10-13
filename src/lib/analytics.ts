/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Artveen - Analytics & CRO Intelligence Engine
 * Standards-compliant tracking for GA4, GTM, Microsoft Clarity, Heatmaps, and Conversion Funnels.
 */

import { Artwork } from '../types';

// Declare global window properties for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

// Session metrics interface for the interactive Insights Dashboard
export interface DashboardMetrics {
  totalSessions: number;
  bounceRate: number; // percentage
  avgScrollDepth: number; // percentage
  conversionRate: number; // percentage
  funnel: {
    galleryViews: number;
    artworkDetailViews: number;
    wishlistClicks: number;
    cartAdds: number;
    checkoutBegins: number;
    purchases: number;
  };
  topArtworks: { [title: string]: number };
  topCollections: { [title: string]: number };
  searchQueries: { query: string; timestamp: string; count: number }[];
  newsletterSignups: { email: string; timestamp: string }[];
  errors404: { path: string; count: number }[];
  brokenLinks: { url: string; count: number }[];
  scrollDepthCount: { '25%': number; '50%': number; '75%': number; '100%': number };
  clickHotspots: { x: number; y: number; page: string; elementId?: string }[];
  userFlow: string[]; // sequence of routes visited in the current session
}

const LOCAL_STORAGE_KEY = 'tanveen_studio_insights';

// Retrieve or initialize local intelligence data
export function getStoredMetrics(): DashboardMetrics {
  const defaultMetrics: DashboardMetrics = {
    totalSessions: 1,
    bounceRate: 15,
    avgScrollDepth: 65,
    conversionRate: 2.4,
    funnel: {
      galleryViews: 120,
      artworkDetailViews: 85,
      wishlistClicks: 34,
      cartAdds: 18,
      checkoutBegins: 8,
      purchases: 3,
    },
    topArtworks: {
      'Ocean Whispers': 48,
      'Saffron Horizon': 32,
      'Symphony of the Sands': 26,
      'Inani Echoes': 19,
    },
    topCollections: {
      'The Ocean Sanctuary': 92,
      'Nature\'s Whispers': 74,
      'Sacred Soil Elements': 41,
    },
    searchQueries: [
      { query: 'ocean', timestamp: new Date(Date.now() - 3600000).toISOString(), count: 12 },
      { query: 'soil pigment', timestamp: new Date(Date.now() - 7200000).toISOString(), count: 5 },
      { query: 'blue canvas', timestamp: new Date(Date.now() - 14400000).toISOString(), count: 3 },
    ],
    newsletterSignups: [
      { email: 'collector.noble@example.com', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { email: 'design.studio@paris.com', timestamp: new Date(Date.now() - 172800000).toISOString() },
    ],
    errors404: [],
    brokenLinks: [],
    scrollDepthCount: { '25%': 110, '50%': 84, '75%': 52, '100%': 31 },
    clickHotspots: [
      { x: 45, y: 12, page: 'home', elementId: 'navbar-shop' },
      { x: 50, y: 80, page: 'home', elementId: 'view-exhibition-btn' },
      { x: 72, y: 24, page: 'artwork-detail', elementId: 'add-to-wishlist' },
    ],
    userFlow: ['home'],
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultMetrics));
      return defaultMetrics;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultMetrics;
  }
}

function updateMetrics(updater: (metrics: DashboardMetrics) => void) {
  try {
    const current = getStoredMetrics();
    updater(current);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update analytics ledger:', e);
  }
}

/**
 * Initialize 3rd party tracker scripts (GA4, GTM, Microsoft Clarity) if credentials are provided in env.
 * Otherwise, initialize professional development consoles.
 */
export function initAnalytics() {
  const metaEnv = (import.meta as any).env || {};
  const GA_ID = metaEnv.VITE_GA_MEASUREMENT_ID;
  const GTM_ID = metaEnv.VITE_GTM_CONTAINER_ID;
  const CLARITY_ID = metaEnv.VITE_CLARITY_PROJECT_ID;

  console.log('%c📊 Studio Intelligence Engine Bootstrapped', 'color: #FF0038; font-weight: bold; font-size: 13px;');

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID || 'G-SIMULATOR-ID', {
    debug_mode: true,
    send_page_view: false,
  });

  // Inject Google Analytics 4 Script
  if (GA_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    console.log(`%c[GA4] Connected with ID: ${GA_ID}`, 'color: #C4D8E2;');
  }

  // Inject Google Tag Manager Script
  if (GTM_ID) {
    const script = document.createElement('script');
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm/js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');`;
    document.head.appendChild(script);
    console.log(`%c[GTM] Container loaded: ${GTM_ID}`, 'color: #C4D8E2;');
  }

  // Inject Microsoft Clarity Script for Heatmaps and Session Replays
  if (CLARITY_ID) {
    const script = document.createElement('script');
    script.innerHTML = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");`;
    document.head.appendChild(script);
    console.log(`%c[Clarity] Thermal tracker connected: ${CLARITY_ID}`, 'color: #C4D8E2;');
  }
}

// 1. Page View / Route Tracking
export function trackPageView(route: string) {
  const pathName = `/${route === 'home' ? '' : route}`;
  const title = `Artveen - ${route.toUpperCase()}`;

  // GA4
  window.gtag('event', 'page_view', {
    page_path: pathName,
    page_title: title,
    page_location: window.location.href,
  });

  // GTM
  window.dataLayer.push({
    event: 'virtual_page_view',
    pagePath: pathName,
    pageTitle: title,
  });

  // Local Insights
  updateMetrics((metrics) => {
    metrics.userFlow = [...metrics.userFlow.slice(-9), route];
    if (route === 'shop') {
      metrics.funnel.galleryViews += 1;
    }
  });
}

// 2. Artwork View Event
export function trackArtworkView(artwork: Artwork) {
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: artwork.price,
    items: [{
      item_id: artwork.id,
      item_name: artwork.title,
      item_category: artwork.theme,
      item_medium: artwork.medium,
      price: artwork.price,
    }],
  });

  updateMetrics((metrics) => {
    metrics.funnel.artworkDetailViews += 1;
    metrics.topArtworks[artwork.title] = (metrics.topArtworks[artwork.title] || 0) + 1;
  });
}

// 3. Collection View Event
export function trackCollectionView(collectionId: string, collectionTitle: string) {
  window.gtag('event', 'view_item_list', {
    item_list_id: collectionId,
    item_list_name: collectionTitle,
  });

  updateMetrics((metrics) => {
    metrics.topCollections[collectionTitle] = (metrics.topCollections[collectionTitle] || 0) + 1;
  });
}

// 4. Wishlist Event
export function trackWishlistEvent(artwork: Artwork, action: 'add' | 'remove') {
  window.gtag('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
    currency: 'USD',
    value: artwork.price,
    items: [{
      item_id: artwork.id,
      item_name: artwork.title,
    }],
  });

  if (action === 'add') {
    updateMetrics((metrics) => {
      metrics.funnel.wishlistClicks += 1;
    });
  }
}

// 5. Add to Cart Event
export function trackAddToCart(artwork: Artwork, option: string, price: number) {
  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: artwork.id,
      item_name: artwork.title,
      item_variant: option,
      price: price,
    }],
  });

  updateMetrics((metrics) => {
    metrics.funnel.cartAdds += 1;
  });
}

// 6. Begin Checkout Event
export function trackCheckoutBegin(items: any[], total: number) {
  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: total,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      item_variant: item.optionType,
      price: item.price,
    })),
  });

  updateMetrics((metrics) => {
    metrics.funnel.checkoutBegins += 1;
  });
}

// 7. Purchase Event
export function trackPurchase(order: any) {
  window.gtag('event', 'purchase', {
    transaction_id: order.id,
    currency: 'USD',
    value: order.totalPrice,
    items: order.items.map((item: any) => ({
      item_id: item.id,
      item_name: item.title,
      item_variant: item.optionType,
      price: item.price,
    })),
  });

  updateMetrics((metrics) => {
    metrics.funnel.purchases += 1;
  });
}

// 8. Search Query Event
export function trackSearch(query: string, resultsCount: number) {
  window.gtag('event', 'search', {
    search_term: query,
    results_count: resultsCount,
  });

  updateMetrics((metrics) => {
    const existing = metrics.searchQueries.find(q => q.query.toLowerCase() === query.toLowerCase());
    if (existing) {
      existing.count += 1;
      existing.timestamp = new Date().toISOString();
    } else {
      metrics.searchQueries.unshift({
        query,
        timestamp: new Date().toISOString(),
        count: 1,
      });
    }
  });
}

// 9. Newsletter Event
export function trackNewsletterSignup(email: string) {
  window.gtag('event', 'sign_up', {
    method: 'Email List',
    form_id: 'studio_newsletter_footer',
  });

  updateMetrics((metrics) => {
    metrics.newsletterSignups.unshift({
      email,
      timestamp: new Date().toISOString(),
    });
  });
}

// 10. 404 Error Event
export function trackError404(path: string) {
  window.gtag('event', 'error_404', {
    page_path: path,
  });

  updateMetrics((metrics) => {
    const existing = metrics.errors404.find(err => err.path === path);
    if (existing) {
      existing.count += 1;
    } else {
      metrics.errors404.push({ path, count: 1 });
    }
  });
}

// 11. Broken Link Event
export function trackBrokenLink(url: string) {
  window.gtag('event', 'broken_link_clicked', {
    url: url,
  });

  updateMetrics((metrics) => {
    const existing = metrics.brokenLinks.find(bl => bl.url === url);
    if (existing) {
      existing.count += 1;
    } else {
      metrics.brokenLinks.push({ url, count: 1 });
    }
  });
}

// 12. Scroll Depth Event
export function trackScrollDepth(depth: 25 | 50 | 75 | 100, page: string) {
  window.gtag('event', 'scroll_depth', {
    depth_percentage: depth,
    page_title: page,
  });

  updateMetrics((metrics) => {
    const key = `${depth}%` as '25%' | '50%' | '75%' | '100%';
    metrics.scrollDepthCount[key] += 1;

    // Recalculate average scroll depth based on relative frequency
    const totalCount = metrics.scrollDepthCount['25%'] + metrics.scrollDepthCount['50%'] + metrics.scrollDepthCount['75%'] + metrics.scrollDepthCount['100%'];
    if (totalCount > 0) {
      const weightedSum = (metrics.scrollDepthCount['25%'] * 25) + (metrics.scrollDepthCount['50%'] * 50) + (metrics.scrollDepthCount['75%'] * 75) + (metrics.scrollDepthCount['100%'] * 100);
      metrics.avgScrollDepth = Math.round(weightedSum / totalCount);
    }
  });
}

// 13. Clicks / Tap Coordinates (For visual heatmap overlay)
export function trackClickCoordinate(clientX: number, clientY: number, page: string, elementId?: string) {
  // Convert coordinate to relative window percentages to support multiple resolution screen sizes
  const xPercent = Math.round((clientX / window.innerWidth) * 100);
  const yPercent = Math.round((clientY / window.innerHeight) * 100);

  // Filter out clicking coordinates that are edge cases or negative
  if (xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100) return;

  updateMetrics((metrics) => {
    metrics.clickHotspots.push({
      x: xPercent,
      y: yPercent,
      page,
      elementId,
    });
    // keep max 200 hotspots to prevent local storage limit bloat
    if (metrics.clickHotspots.length > 200) {
      metrics.clickHotspots.shift();
    }
  });
}
