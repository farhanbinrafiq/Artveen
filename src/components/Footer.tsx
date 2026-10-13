/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle, MapPin, Award, Mail, ArrowUp, ArrowRight, Instagram, Compass, BookOpen, Layers } from 'lucide-react';
import { trackNewsletterSignup } from '../lib/analytics';
import { getArtworkSvg } from '../data';

export const Footer: React.FC = () => {
  const { setRoute, collections } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    trackNewsletterSignup(emailInput);
    setIsSubscribed(true);
    setEmailInput('');
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerArtBackground = getArtworkSvg('monsoon', 'Closing Chapter Canvas');

  return (
    <footer className="w-full relative bg-canvas-white text-charcoal-ink font-sans border-t border-soft-border/80 overflow-hidden" id="global-footer" aria-label="Global Directory">
      
      {/* ========================================================= */}
      {/* STANDALONE PREMIUM NEWSLETTER SECTION (Above footer grid) */}
      {/* ========================================================= */}
      <div className="w-full bg-[#FAF9F5] py-20 border-b border-soft-border text-left relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              The Studio Registry
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-light text-charcoal-ink tracking-tight">
              Subscribe to the Dispatch
            </h3>
            <p className="text-xs md:text-sm text-slate-gray font-light max-w-lg leading-relaxed">
              Receive private diary pages, early invitations to seasonal exhibitions, curatorial essays, and priority booking on limited giclée print runs.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-end w-full" id="premium-newsletter-cta-block">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="w-full max-w-md group space-y-3">
                <label htmlFor="newsletter-email-field" className="sr-only">
                  Email Address
                </label>
                <div className="relative flex items-center border border-[#CCCCCC] rounded-xs bg-pure-white focus-within:border-charcoal-ink transition-all duration-300">
                  <input
                    type="email"
                    required
                    id="newsletter-email-field"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email for private updates..."
                    className="w-full py-4 pl-4 pr-12 text-sm text-charcoal-ink placeholder-slate-gray/40 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-2 text-[#555555] hover:text-signature-carmine transition-colors duration-300 focus:outline-none cursor-pointer"
                    id="newsletter-submit-btn"
                    title="Submit Subscription"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[9px] text-slate-gray/60 font-mono tracking-wide">
                  By joining, you agree to our private ledger collectors protocol. Zero spam.
                </p>
              </form>
            ) : (
              <div className="w-full max-w-md bg-studio-mist/20 border border-signature-carmine/20 rounded-xs p-6 flex items-start space-x-4 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-signature-carmine shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-charcoal-ink">Welcome to the inner circle.</h4>
                  <p className="text-[11px] text-slate-gray mt-1 leading-relaxed">Your ledger credential is logged. Private collection alerts will arrive at your inbox.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* REDESIGNED GALLERY FOOTER (The Closing Chapter) */}
      {/* ========================================================= */}
      <div className="relative pt-24 pb-16 z-0">
        
        {/* Full-width artistic background watermark with perfect legibility overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.03] select-none scale-105"
          style={{ backgroundImage: `url("${footerArtBackground}")` }}
        />
        
        {/* Clean layout container layered above */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-soft-border/50 relative z-10 text-left">
          
          {/* Column 1: Brand pitch & Coordinate Indicators (takes 5 columns) */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-light tracking-tight text-charcoal-ink">
                Tanveen Fine Art
              </h2>
              <div className="inline-block">
                <span className="bg-gallery-blue/20 text-charcoal-ink border border-gallery-blue/50 px-3 py-1 rounded-xs text-[8px] tracking-[0.25em] uppercase font-bold font-sans">
                  Boutique Editorial Art Gallery
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-gray leading-relaxed max-w-sm font-light">
              An immersive showcase of heavy sea salt canvases, custom mineral-powder pigments, and deep coastal stories captured in solitary studios of Cox’s Bazar.
            </p>

            <div className="space-y-4 pt-4 border-t border-soft-border/40 max-w-xs">
              <span className="text-[8px] uppercase tracking-[0.2em] font-mono text-slate-gray/80 font-bold block">
                Primary Coordinate Registry
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-slate-gray font-sans font-light">
                <a 
                  href="mailto:studio@tanveenartescape.com" 
                  className="text-charcoal-ink font-medium hover:text-signature-carmine transition-colors duration-300 flex items-center gap-2 group w-fit"
                >
                  <Mail className="w-3.5 h-3.5 text-[#555555] group-hover:text-signature-carmine" />
                  <span className="underline decoration-dotted underline-offset-4">studio@tanveenartescape.com</span>
                </a>
                <div className="text-slate-gray flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Dhaka & Cox's Bazar, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Exhibitions directories - 2 columns) */}
          <div className="md:col-span-2.5 space-y-6 md:pl-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-charcoal-ink font-bold font-mono flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-gallery-blue" />
              <span>Catalog Index</span>
            </h4>
            <nav aria-label="Directory Navigation">
              <ul className="space-y-3">
                {[
                  { route: 'home', label: 'Home Editorial' },
                  { route: 'shop', label: 'Active Exhibition' },
                  { route: 'collections', label: 'Curated Series' },
                  { route: 'journal', label: 'Studio Journal' },
                  { route: 'portfolio', label: 'Artist Portfolio' },
                  { route: 'portal', label: 'Patron Registry' },
                ].map((item) => (
                  <li key={item.route} className="group/nav flex items-center text-xs">
                    <button
                      onClick={() => setRoute(item.route)}
                      className="text-slate-gray hover:text-signature-carmine font-sans font-light transition-all duration-300 text-left focus:outline-none cursor-pointer relative py-0.5"
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Curated Collections (Directories - 2.5 columns) */}
          <div className="md:col-span-2.5 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-charcoal-ink font-bold font-mono flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-gallery-blue" />
              <span>Series Chambers</span>
            </h4>
            <ul className="space-y-3">
              {collections.map((col) => (
                <li key={col.id} className="text-xs">
                  <button
                    onClick={() => setRoute('collection-detail', col.id)}
                    className="text-slate-gray hover:text-signature-carmine font-sans font-light transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    {col.title} Series
                  </button>
                </li>
              ))}
              <li className="text-xs pt-1 border-t border-soft-border/30">
                <button
                  onClick={() => setRoute('collections')}
                  className="text-signature-carmine hover:underline text-[10px] font-mono tracking-wider uppercase font-semibold"
                >
                  All Exhibitions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Media Coordinates (3 columns) */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-charcoal-ink font-bold font-mono flex items-center space-x-1.5">
              <Instagram className="w-3.5 h-3.5 text-gallery-blue" />
              <span>Media Coordinates</span>
            </h4>
            <div className="flex flex-col gap-3 text-xs font-sans font-light text-slate-gray">
              {['Instagram', 'Artsy', 'Pinterest', 'Vimeo'].map((platform) => (
                <a
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-signature-carmine transition-all duration-300 w-fit"
                  aria-label={`Official ${platform} account`}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* UNDER FOOTER COPYRIGHT & LEDGER PROVENANCE */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-12 flex flex-col lg:flex-row items-center justify-between text-[10px] text-slate-gray/70 font-light font-sans gap-6 relative z-10">
          <div className="space-y-1 text-center lg:text-left">
            <span>© 2026 Tanveen Fine Art. All rights reserved. Registered Physical Ledger validation tokens apply.</span>
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-[9px] text-slate-gray/50 font-mono mt-0.5">
              <Award className="w-3.5 h-3.5 text-signature-carmine" />
              <span>Guaranteed Physical Provenance Ledger Tracking Protocol</span>
            </div>
          </div>
          
          {/* Scroll back up & terms */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[9px] uppercase tracking-wider">
            <button 
              onClick={() => { setRoute('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-charcoal-ink hover:text-signature-carmine transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              Terms of Artistry
            </button>
            <button 
              onClick={() => { setRoute('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-charcoal-ink hover:text-signature-carmine transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              Privacy Codex
            </button>
            <span className="text-soft-border hidden sm:inline">|</span>
            <button 
              onClick={handleBackToTop}
              className="inline-flex items-center space-x-2 text-charcoal-ink hover:text-signature-carmine transition-all duration-300 font-mono focus:outline-none cursor-pointer group"
              aria-label="Scroll back to top of the page"
            >
              <span>Scroll to Top</span>
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-300 text-slate-gray group-hover:text-signature-carmine" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
