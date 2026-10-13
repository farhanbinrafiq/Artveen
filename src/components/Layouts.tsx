/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Shield, User, Database, Eye } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Standard public editorial layout with header, main container, and footer.
 */
export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  const { siteSettings } = useApp();
  
  return (
    <div className="min-h-screen bg-canvas-white text-charcoal-ink flex flex-col justify-between selection:bg-signature-carmine selection:text-canvas-white transition-colors duration-300">
      {/* Announcement Bar */}
      {siteSettings.announcement?.visible && (
        <div className="bg-[#1C1C1C] text-canvas-white text-[10px] md:text-xs text-center py-2.5 px-4 font-mono uppercase tracking-[0.15em] border-b border-soft-border/15">
          {siteSettings.announcement.text}
        </div>
      )}
      
      <Header />
      
      <main id="main-content" className="flex-grow pt-24 md:pt-28">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

/**
 * Layout specifically designed for active collectors to inspect purchases, COAs, and wishlist rooms.
 */
export const CollectorLayout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useApp();
  
  return (
    <div className="min-h-screen bg-canvas-white text-charcoal-ink flex flex-col justify-between transition-colors duration-300">
      <Header />
      
      <main id="main-content" className="flex-grow pt-24 md:pt-28">
        {/* Dynamic header summary */}
        <div className="border-b border-soft-border bg-studio-mist/40 py-8 px-6 md:px-12 mb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-gray text-[10px] font-mono uppercase tracking-widest mb-1">
                <Shield className="w-3 h-3 text-[#C4D8E2]" /> Secure Patron Ledger
              </div>
              <h2 className="text-xl font-serif font-bold text-charcoal-ink">
                Welcome back, {currentUser.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-canvas-white border border-soft-border px-3 py-1.5 rounded-full text-[10px] font-mono text-slate-gray shadow-xs">
              <span className="w-2 h-2 rounded-full bg-signature-carmine animate-pulse" /> Registered Account: {currentUser.email}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

/**
 * Prepared Layout for future Artist Workstation integrations.
 */
export const ArtistLayout: React.FC<LayoutProps> = ({ children }) => {
  const { activeArtistId } = useApp();
  
  return (
    <div className="min-h-screen bg-canvas-white text-charcoal-ink flex flex-col justify-between transition-colors duration-300">
      <Header />
      
      <main id="main-content" className="flex-grow pt-24 md:pt-28">
        <div className="border-b border-soft-border bg-[#1C1C1C] text-canvas-white py-10 px-6 md:px-12 mb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-gray text-[10px] font-mono uppercase tracking-widest mb-1">
                <User className="w-3.5 h-3.5 text-signature-carmine" /> Artist Workspace Shell
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tight">
                Co-Creator Studio Room
              </h2>
            </div>
            <div className="text-[10px] font-mono text-slate-gray bg-canvas-white/10 px-3 py-1.5 rounded-lg">
              Active Registry Id: {activeArtistId}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

/**
 * Clean sandbox layout with zero surrounding shells. Perfect for interactive CMS preview windows.
 */
export const CMSPreviewLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas-white text-charcoal-ink flex flex-col selection:bg-signature-carmine selection:text-canvas-white transition-all duration-300">
      {/* Dynamic preview watermark banner */}
      <div className="bg-[#FF0038] text-canvas-white text-[9px] font-mono uppercase tracking-[0.25em] text-center py-2.5 px-4 flex items-center justify-center gap-2 border-b border-soft-border/20 z-50">
        <Eye className="w-3 h-3" /> Live Sandbox CMS Preview Mode
      </div>
      <main id="main-content" className="flex-grow">
        {children}
      </main>
    </div>
  );
};
