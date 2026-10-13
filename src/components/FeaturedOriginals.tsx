/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedOriginals: React.FC = () => {
  const { artworks, wishlist, toggleWishlist, setRoute } = useApp();

  // Filter available originals that are featured
  const featuredOriginals = artworks
    .filter(art => art.isOriginal && !art.isSold)
    .slice(0, 3);

  if (featuredOriginals.length === 0) return null;

  const heroArt = featuredOriginals[0];
  const supportingArt = featuredOriginals.slice(1);

  const isHeroLiked = wishlist.includes(heroArt.id);

  return (
    <section className="w-full bg-canvas-white paper-texture py-24 md:py-32 text-left relative overflow-hidden" id="home-featured-originals">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-soft-border/60 pb-8 mb-20">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Unique Masterpieces
            </span>
            <h3 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
              Original Canvases
            </h3>
          </div>
          <button
            onClick={() => setRoute('shop')}
            className="group text-xs uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine inline-flex items-center space-x-2 transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <span>Explore Original Registry</span>
            <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-signature-carmine group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cinematic Masterpiece Highlight (Hero Original) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-32" id={`hero-original-${heroArt.id}`}>
          
          {/* Frameless high-impact artwork container */}
          <div className="lg:col-span-7 group relative">
            <div 
              onClick={() => setRoute('artwork-detail', heroArt.id)}
              className="relative aspect-16/11 bg-[#F9F8F5] border border-soft-border rounded-xs p-12 flex items-center justify-center cursor-pointer overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.02)] group-hover:border-gallery-blue/80 transition-all duration-700"
            >
              <img
                src={heroArt.image}
                alt={heroArt.title}
                className="max-h-full max-w-full object-contain shadow-[0_16px_40px_rgba(0,0,0,0.1)] group-hover:scale-[1.01] transition-transform duration-1000 ease-out bg-white p-2.5 border border-soft-border/50"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle visual gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/[0.02] to-transparent pointer-events-none" />

              {/* Museum catalog coordinate label */}
              <span className="absolute bottom-6 left-6 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-gray/60">
                COORDINATES • BH-01
              </span>
            </div>
          </div>

          {/* Curatorial Storytelling & Specifications */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.25em] text-signature-carmine font-mono font-bold">
                  Curated Solitary Piece
                </span>
                <span className="text-lg font-serif font-light text-charcoal-ink">
                  ${heroArt.price.toLocaleString()}
                </span>
              </div>
              <h4 
                onClick={() => setRoute('artwork-detail', heroArt.id)}
                className="font-serif text-3xl md:text-4xl font-light text-charcoal-ink hover:text-signature-carmine cursor-pointer transition-colors"
              >
                {heroArt.title}
              </h4>
            </div>

            <p className="text-slate-gray font-sans font-light leading-relaxed text-sm md:text-base">
              {heroArt.description}
            </p>

            {heroArt.story && (
              <div className="bg-studio-mist/20 border border-soft-border/50 p-5 rounded-xs space-y-2">
                <span className="text-[8px] uppercase tracking-widest text-slate-gray font-mono font-bold block">Artisanal Story</span>
                <p className="text-xs text-charcoal-ink font-serif italic leading-relaxed">
                  "{heroArt.story}"
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-soft-border/50 grid grid-cols-2 gap-6 text-[10px] font-mono text-slate-gray uppercase tracking-wider">
              <div>
                <span className="block text-[8px] text-slate-gray/60 font-semibold mb-1">Medium</span>
                <span className="text-charcoal-ink block font-medium font-sans text-xs lowercase first-letter:uppercase">{heroArt.medium}</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-gray/60 font-semibold mb-1">Format / Scale</span>
                <span className="text-charcoal-ink block font-medium font-sans text-xs">{heroArt.size}</span>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setRoute('artwork-detail', heroArt.id)}
                className="bg-charcoal-ink text-canvas-white hover:bg-signature-carmine px-6 py-3.5 rounded-xs font-bold tracking-widest uppercase text-[9px] font-sans transition-all duration-300 cursor-pointer focus:outline-none shadow-xs"
              >
                Observe Masterpiece
              </button>

              <button
                onClick={() => toggleWishlist(heroArt.id)}
                className={`p-3 rounded-xs border transition-all duration-300 cursor-pointer focus:outline-none ${
                  isHeroLiked 
                    ? 'bg-signature-carmine/10 text-signature-carmine border-signature-carmine/30' 
                    : 'bg-pure-white text-slate-gray border-soft-border hover:border-signature-carmine hover:text-signature-carmine'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isHeroLiked ? 'fill-signature-carmine' : ''}`} />
              </button>
            </div>
          </div>

        </div>

        {/* Staggered Supporting Original Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {supportingArt.map((art, idx) => {
            const isLiked = wishlist.includes(art.id);
            const isOffset = idx % 2 === 1;
            return (
              <div
                key={art.id}
                className={`group flex flex-col relative transition-all duration-500 text-left bg-transparent ${isOffset ? 'md:translate-y-12' : ''}`}
                id={`featured-orig-${art.id}`}
              >
                {/* Visual Media Container - Like an archival matted frame */}
                <div 
                  onClick={() => setRoute('artwork-detail', art.id)}
                  className="relative aspect-4/3 overflow-hidden bg-[#FAF9F6] border border-soft-border rounded-xs p-8 flex items-center justify-center cursor-pointer transition-all duration-500 group-hover:border-gallery-blue/80"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="max-h-full max-w-full object-contain shadow-[0_8px_25px_rgba(0,0,0,0.06)] group-hover:scale-[1.01] transition-transform duration-700 ease-out bg-white p-2 border border-soft-border/40"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Subtle gallery ambient gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/[0.01] to-transparent pointer-events-none" />

                  {/* Floating theme tag */}
                  <span className="absolute top-4 left-4 bg-canvas-white/95 backdrop-blur-xs border border-soft-border text-[8px] uppercase tracking-[0.2em] font-mono text-slate-gray px-2.5 py-1 rounded-xs shadow-xs">
                    {art.theme}
                  </span>

                  {/* Wishlist quick save */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(art.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-canvas-white/90 backdrop-blur-xs text-slate-gray hover:text-signature-carmine rounded-full border border-soft-border shadow-xs z-10 transition-all duration-300 cursor-pointer focus:outline-none"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-signature-carmine text-signature-carmine' : ''}`} />
                  </button>
                </div>

                {/* Metadata */}
                <div className="pt-6 space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 
                      onClick={() => setRoute('artwork-detail', art.id)}
                      className="font-serif text-xl font-light text-charcoal-ink hover:text-signature-carmine transition-colors cursor-pointer"
                    >
                      {art.title}
                    </h4>
                    <span className="font-serif text-sm font-light text-charcoal-ink">
                      ${art.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-gray font-sans font-light leading-relaxed text-xs md:text-sm">
                    {art.description}
                  </p>

                  <div className="border-t border-soft-border/50 pt-4 flex items-center justify-between text-[10px] text-slate-gray font-mono uppercase tracking-wider">
                    <span>{art.size} • {art.medium}</span>
                    <button
                      onClick={() => setRoute('artwork-detail', art.id)}
                      className="text-[9px] uppercase tracking-widest font-bold text-signature-carmine hover:underline inline-flex items-center space-x-1 cursor-pointer focus:outline-none"
                    >
                      <span>Observe Story</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
