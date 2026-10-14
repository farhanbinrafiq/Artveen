/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle, MapPin, Award, Mail, Phone, ArrowUp, Instagram, Facebook, Youtube, Compass, Layers } from 'lucide-react';
import { trackNewsletterSignup } from '../lib/analytics';
import { getArtworkSvg } from '../data';
import { ArtveenLogo } from './ArtveenLogo';

// lucide-react ships no TikTok glyph, so this mirrors its 24px stroke icon API.
const TikTok: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.9 2.3 4.8 5.5 5" />
  </svg>
);

const CONTACT = {
  phone: '+880 0141 0423014',
  phoneHref: '+88001410423014',
  email: 'studio@artveen.com',
  address: 'Sector 11, Uttara 1230 Dhaka, Bangladesh',
};

const SOCIAL_LINKS = [
  { label: 'Facebook', handle: '@Artveen07', href: 'https://www.facebook.com/Artveen07/', Icon: Facebook },
  { label: 'Instagram', handle: '@tanveencreates', href: 'https://www.instagram.com/tanveencreates/', Icon: Instagram },
  { label: 'YouTube', handle: '@Artveen07', href: 'https://www.youtube.com/@Artveen07', Icon: Youtube },
  { label: 'TikTok', handle: '@tanveencreates', href: 'https://www.tiktok.com/@tanveencreates', Icon: TikTok },
];

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
    <footer className="w-full relative bg-artveen-plum text-white font-sans overflow-hidden" id="global-footer" aria-label="Global Directory">
      
      {/* ========================================================= */}
      {/* STANDALONE PREMIUM NEWSLETTER SECTION (Above footer grid) */}
      {/* ========================================================= */}
      <div className="w-full bg-[#FAF9F5] py-20 border-b border-soft-border text-left relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-artveen-red font-bold font-sans block">
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
      {/* BRAND FOOTER (Artveen plum, white logo, gold accents) */}
      {/* ========================================================= */}
      <div className="relative pt-20 pb-12 z-0 bg-artveen-plum text-white">

        {/* Full-width artistic background watermark with perfect legibility overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.04] select-none scale-105"
          style={{ backgroundImage: `url("${footerArtBackground}")` }}
        />

        {/* Clean layout container layered above */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10 relative z-10 text-left">

          {/* Column 1: Brand pitch & contact details */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-4">
              <h2 className="sr-only">Artveen</h2>
              <ArtveenLogo tagline className="h-28 md:h-32 w-auto -ml-2" />
              <div className="inline-block">
                <span className="text-artveen-gold border border-artveen-gold/40 px-3 py-1 rounded-xs text-[8px] tracking-[0.25em] uppercase font-bold font-sans">
                  Boutique Editorial Art Gallery
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm font-light">
              An immersive showcase of heavy sea salt canvases, custom mineral-powder pigments, and deep coastal stories captured in solitary studios of Cox’s Bazar.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10 max-w-sm">
              <span className="text-[8px] uppercase tracking-[0.2em] font-mono text-artveen-gold font-bold block">
                Get in Touch
              </span>
              <div className="flex flex-col gap-3 text-xs font-sans font-light">
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="text-white hover:text-artveen-gold transition-colors duration-300 flex items-center gap-2.5 w-fit"
                >
                  <Phone className="w-3.5 h-3.5 text-artveen-gold" />
                  <span>{CONTACT.phone}</span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-white hover:text-artveen-gold transition-colors duration-300 flex items-center gap-2.5 w-fit"
                >
                  <Mail className="w-3.5 h-3.5 text-artveen-gold" />
                  <span className="underline decoration-dotted underline-offset-4">{CONTACT.email}</span>
                </a>
                <div className="text-white/80 flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-artveen-gold shrink-0 mt-0.5" />
                  <span>{CONTACT.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-artveen-gold! font-bold font-mono! flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5" />
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
                  <li key={item.route} className="flex items-center text-xs">
                    <button
                      onClick={() => setRoute(item.route)}
                      className="text-white/70 hover:text-artveen-gold font-sans font-light transition-all duration-300 text-left focus:outline-none cursor-pointer py-0.5"
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Curated Collections */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-artveen-gold! font-bold font-mono! flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Series Chambers</span>
            </h4>
            <ul className="space-y-3">
              {collections.map((col) => (
                <li key={col.id} className="text-xs">
                  <button
                    onClick={() => setRoute('collection-detail', col.id)}
                    className="text-white/70 hover:text-artveen-gold font-sans font-light transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    {col.title} Series
                  </button>
                </li>
              ))}
              <li className="text-xs pt-1 border-t border-white/10">
                <button
                  onClick={() => setRoute('collections')}
                  className="text-artveen-gold hover:underline text-[10px] font-mono tracking-wider uppercase font-semibold"
                >
                  All Exhibitions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Social media */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-artveen-gold! font-bold font-mono!">
              Follow Artveen
            </h4>
            <div className="flex flex-col gap-3 text-xs font-sans font-light">
              {SOCIAL_LINKS.map(({ label, handle, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-fit text-white/80 hover:text-white transition-colors duration-300"
                  aria-label={`Artveen on ${label}`}
                >
                  <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-artveen-red group-hover:border-artveen-red transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-medium">{label}</span>
                    <span className="text-[10px] text-white/50 group-hover:text-artveen-gold transition-colors">{handle}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* UNDER FOOTER COPYRIGHT & LEDGER PROVENANCE */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-10 flex flex-col lg:flex-row items-center justify-between text-[10px] text-white/60 font-light font-sans gap-6 relative z-10">
          <div className="space-y-1 text-center lg:text-left">
            <span>© {new Date().getFullYear()} Artveen. All rights reserved. Registered Physical Ledger validation tokens apply.</span>
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-[9px] text-white/40 font-mono mt-0.5">
              <Award className="w-3.5 h-3.5 text-artveen-gold" />
              <span>Guaranteed Physical Provenance Ledger Tracking Protocol</span>
            </div>
          </div>

          {/* Scroll back up & terms */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[9px] uppercase tracking-wider">
            <button
              onClick={() => { setRoute('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-white/80 hover:text-artveen-gold transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              Terms of Artistry
            </button>
            <button
              onClick={() => { setRoute('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-white/80 hover:text-artveen-gold transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              Privacy Codex
            </button>
            <span className="text-white/20 hidden sm:inline">|</span>
            <button
              onClick={handleBackToTop}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-artveen-gold transition-all duration-300 font-mono focus:outline-none cursor-pointer group"
              aria-label="Scroll back to top of the page"
            >
              <span>Scroll to Top</span>
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
