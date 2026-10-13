/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { LivingGallery } from './components/LivingGallery';
import { FeaturedCollections } from './components/FeaturedCollections';
import { FeaturedOriginals } from './components/FeaturedOriginals';
import { EditorsPicks } from './components/EditorsPicks';
import { ShopGallery } from './components/ShopGallery';
import { ArtworkDetail } from './components/ArtworkDetail';
import { CollectionsView } from './components/CollectionsView';
import { JournalView } from './components/JournalView';
import { PortfolioView } from './components/PortfolioView';
import { CollectorPortal } from './components/CollectorPortal';
import { AdminCMS } from './components/AdminCMS';
import { CheckoutView } from './components/CheckoutView';
import { ArtistStory, JournalPreview, Testimonials } from './components/HomeEditorial';
import { Footer } from './components/Footer';
import { initAnalytics, trackPageView, trackScrollDepth, trackClickCoordinate } from './lib/analytics';
import { LegalPages } from './components/LegalPages';
import { CookieConsent } from './components/CookieConsent';

import { PublicLayout, CollectorLayout, ArtistLayout, CMSPreviewLayout } from './components/Layouts';

// Inner component to leverage AppContext
const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  // Bootstrap Analytics
  React.useEffect(() => {
    initAnalytics();
  }, []);

  // Scroll to top automatically when navigating between pages
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(currentRoute);
  }, [currentRoute]);

  // Global scroll depth and click trackers (CRO Intelligence)
  React.useEffect(() => {
    const trackedThresholds = new Set<number>();
    
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / docHeight) * 100);

      [25, 50, 75, 100].forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackScrollDepth(threshold as 25 | 50 | 75 | 100, currentRoute);
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const elementId = target?.id || target?.closest('[id]')?.id || undefined;
      trackClickCoordinate(e.clientX, e.clientY, currentRoute, elementId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, [currentRoute]);

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <>
            <HomeHero />
            <LivingGallery />
            <FeaturedCollections />
            <FeaturedOriginals />
            <EditorsPicks />
            <ArtistStory />
            <JournalPreview />
            <Testimonials />
          </>
        );
      case 'shop':
        return <ShopGallery />;
      case 'checkout':
        return <CheckoutView />;
      case 'artwork-detail':
        return <ArtworkDetail />;
      case 'collections':
      case 'collection-detail':
        return <CollectionsView />;
      case 'journal':
      case 'journal-detail':
        return <JournalView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'portal':
        return <CollectorPortal />;
      case 'cms':
        return <AdminCMS />;
      case 'terms':
        return <LegalPages type="terms" />;
      case 'privacy':
        return <LegalPages type="privacy" />;
      default:
        return <LivingGallery />;
    }
  };

  const renderContentInLayout = () => {
    const activeRouteContent = renderActiveRoute();
    
    if (currentRoute === 'portal') {
      return <CollectorLayout>{activeRouteContent}</CollectorLayout>;
    }
    if (currentRoute === 'cms') {
      return <ArtistLayout>{activeRouteContent}</ArtistLayout>;
    }
    if (currentRoute === 'preview') {
      return <CMSPreviewLayout>{activeRouteContent}</CMSPreviewLayout>;
    }
    
    return <PublicLayout>{activeRouteContent}</PublicLayout>;
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-signature-carmine focus:text-canvas-white focus:text-xs focus:font-mono focus:tracking-wider focus:outline-none focus:ring-2 focus:ring-signature-carmine focus:ring-offset-2 transition-all duration-200">
        Skip to main content
      </a>
      {renderContentInLayout()}
      <CookieConsent />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
