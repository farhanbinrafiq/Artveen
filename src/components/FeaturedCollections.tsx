/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedCollections: React.FC = () => {
  const { collections, setRoute } = useApp();

  return (
    <section className="w-full bg-[#FCFBF9] paper-texture py-24 md:py-32 border-t border-b border-soft-border text-left relative overflow-hidden" id="home-featured-collections">
      {/* Decorative abstract lines */}
      <div className="absolute right-0 top-1/4 w-32 h-[1px] bg-soft-border/40" />
      <div className="absolute left-0 bottom-1/4 w-32 h-[1px] bg-soft-border/40" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Editorial Title Block - Classic & Minimal */}
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-soft-border/60 pb-8 mb-24">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Curated Series Anthologies
            </span>
            <h3 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
              Featured Exhibitions
            </h3>
          </div>
          <button
            onClick={() => setRoute('collections')}
            className="group text-xs uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine inline-flex items-center space-x-2 transition-all duration-300 focus:outline-none cursor-pointer"
            id="collections-index-link"
          >
            <span>Browse All Curations</span>
            <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-signature-carmine group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Curated Collections - Alternating Asymmetrical Rhythm */}
        <div className="space-y-36">
          {collections.map((col, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={col.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
                id={`featured-col-${col.id}`}
              >
                {/* Visual Media Container */}
                <div 
                  className={`lg:col-span-7 relative group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div 
                    onClick={() => setRoute('collection-detail', col.id)}
                    className="aspect-16/10 rounded-xs overflow-hidden cursor-pointer relative bg-[#FAF9F5] border border-soft-border p-4 shadow-[0_12px_40px_rgba(0,0,0,0.015)] group-hover:border-gallery-blue/65 transition-all duration-700"
                  >
                    <img
                      src={col.coverImage}
                      alt={col.title}
                      className="w-full h-full object-cover rounded-xs group-hover:scale-[1.01] transition-transform duration-1000 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Subtle aesthetic gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#C4D8E2]/5 via-[#F0FFF0]/5 to-transparent opacity-60 pointer-events-none group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Elegant Minimalist Volume badge */}
                    <div className="absolute top-8 left-8 bg-canvas-white/95 backdrop-blur-xs px-3 py-1.5 border border-soft-border rounded-xs text-[8px] uppercase tracking-[0.2em] font-mono text-slate-gray shadow-xs">
                      Exhibition Series Vol. 0{idx + 1}
                    </div>
                  </div>
                </div>

                {/* Narrative Details Block */}
                <div 
                  className={`lg:col-span-5 space-y-8 ${isEven ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'}`}
                >
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-slate-gray font-mono font-bold block">
                      Exhibition Theme
                    </span>
                    <h4 
                      onClick={() => setRoute('collection-detail', col.id)}
                      className="font-serif text-3xl md:text-4xl font-light leading-snug text-charcoal-ink hover:text-signature-carmine transition-colors cursor-pointer"
                    >
                      The {col.title} Series
                    </h4>
                  </div>
                  
                  <p className="text-slate-gray font-sans font-light leading-relaxed text-sm md:text-base">
                    {col.description}
                  </p>

                  {col.story && (
                    <p className="text-xs text-slate-gray/80 leading-relaxed font-serif italic border-l-2 border-gallery-blue pl-4">
                      "{col.story.substring(0, 160)}..."
                    </p>
                  )}
                  
                  <div className="pt-4 border-t border-soft-border/50 flex justify-between items-center">
                    <button
                      onClick={() => setRoute('collection-detail', col.id)}
                      className="group inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine transition-all duration-300 cursor-pointer focus:outline-none"
                    >
                      <span>Explore Gallery Room</span>
                      <ChevronRight className="w-4 h-4 text-gallery-blue group-hover:text-signature-carmine group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[9px] text-slate-gray/40 font-mono">Curated Archive • 2026</span>
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
