/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const EditorsPicks: React.FC = () => {
  const { artworks, setRoute } = useApp();

  // Find two featured artworks for side-by-side deep picks
  const picks = artworks.filter(art => art.featured).slice(0, 2);

  if (picks.length < 2) return null;

  return (
    <section className="w-full bg-[#FCFAF5] paper-texture py-20 border-b border-soft-border text-left" id="home-editors-picks">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <div className="border-b border-soft-border/50 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-signature-carmine font-semibold font-sans block">
            Critical Review
          </span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-ink mt-1">
            Editor’s Exhibition Picks
          </h3>
          <p className="text-xs text-slate-gray font-sans mt-2 max-w-xl font-light">
            Each seasonal release is accompanied by curatorial critiques highlighting complex textures, mineral formulations, and historical provenance.
          </p>
        </div>

        {/* Picks grid - asymmetric editorial layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {picks.map((art, idx) => (
            <div
              key={art.id}
              className={`flex flex-col space-y-6 ${idx % 2 === 1 ? 'md:translate-y-8' : ''}`}
              id={`editors-pick-${art.id}`}
            >
              {/* Image Frame - Frameless archival style with deep shadow */}
              <div 
                onClick={() => setRoute('artwork-detail', art.id)}
                className="aspect-16/10 bg-[#FAF9F5] p-6 border border-soft-border rounded-xs hover:border-gallery-blue transition-premium cursor-pointer overflow-hidden flex items-center justify-center group"
                style={{
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.015)'
                }}
              >
                <img
                  src={art.image}
                  alt={art.title}
                  className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.01] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Critiques */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-soft-border/50 pb-2">
                  <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-signature-carmine font-bold">
                    Selection Vol. 0{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-gray/60 font-mono tracking-wider">{art.size}</span>
                </div>
                
                <h4 
                  onClick={() => setRoute('artwork-detail', art.id)}
                  className="font-serif text-3xl font-light text-charcoal-ink hover:text-signature-carmine transition-premium cursor-pointer"
                >
                  {art.title}
                </h4>

                {/* Simulated critical review paragraph - High-end editorial magazine quote */}
                <div className="relative text-xs text-charcoal-ink/90 leading-relaxed font-serif bg-[#FFFAFA] border border-soft-border p-6 rounded-xs border-l-2 border-l-signature-carmine">
                  <span className="absolute -top-3 -left-1 text-4xl font-serif text-gallery-blue/50 pointer-events-none">“</span>
                  <p className="relative z-10 leading-relaxed">
                    In '{art.title}', the application of coarse Cox's Bazar sea salt acts as a crystalline agent, shattering the matte finish of traditional modeling pastes. This juxtaposition produces a shimmering glare that replicates the true visual glare of the Bay of Bengal coastline.
                  </p>
                  <span className="block text-right text-[9px] font-sans uppercase tracking-widest font-bold text-slate-gray/70 mt-4">
                    — Editorial Review, Art Asia Pacific
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setRoute('artwork-detail', art.id)}
                    className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine transition-premium cursor-pointer focus:outline-none"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-gallery-blue" />
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5 text-signature-carmine" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
