/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_JOURNAL, INITIAL_TESTIMONIALS } from '../data';
import { ArrowRight, Quote, Feather, ArrowUpRight } from 'lucide-react';

// ==========================================
// 1. Artist Story Section (Editorial Intro)
// ==========================================
export const ArtistStory: React.FC = () => {
  const { setRoute } = useApp();

  return (
    <section 
      className="relative w-full py-28 md:py-36 bg-canvas-white paper-texture overflow-hidden border-b border-soft-border text-left"
      id="homepage-artist-story"
    >
      {/* Decorative vertical guide rails */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left: Artistic Portrait & Palette representation (Asymmetrical Frame) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-md aspect-[4/5] bg-[#FAF9F6] border border-soft-border p-10 rounded-xs flex flex-col justify-between items-start shadow-[0_20px_50px_rgba(0,0,0,0.015)] hover:border-signature-carmine/25 transition-colors duration-700">
              
              {/* Subtle top index marker */}
              <span className="font-mono text-[9px] text-slate-gray/60 tracking-widest block uppercase">
                BIOGRAPHY • DOSSIER 01
              </span>

              <div className="my-auto space-y-6">
                <div className="w-16 h-16 bg-studio-mist border border-soft-border/50 rounded-full flex items-center justify-center text-charcoal-ink relative group">
                  <Feather className="w-7 h-7 text-signature-carmine stroke-[1.2] transition-transform duration-500 group-hover:rotate-12" />
                  <div className="absolute inset-0 border border-signature-carmine/20 rounded-full animate-ping opacity-25 pointer-events-none" />
                </div>
                
                <h3 className="font-serif text-3xl font-light text-charcoal-ink">
                  Tanveen
                </h3>
                
                <p className="text-xs md:text-sm text-slate-gray font-serif italic leading-relaxed">
                  "My canvases are physical sediments of sand, salt, and rainwater. I build them slowly to let nature write its own unpredictable signature."
                </p>
              </div>

              {/* Coordinates block inside portrait */}
              <div className="pt-6 border-t border-soft-border/60 w-full flex justify-between items-baseline text-[9px] font-mono text-slate-gray">
                <span>ESTABLISHED 2026</span>
                <span>21.4113° N, 91.9818° E</span>
              </div>
            </div>
          </div>

          {/* Right: Rich Narrative & CTA */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold block">
                The Philosophy
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-charcoal-ink leading-tight tracking-tight">
                A Dialogue of <span className="italic text-signature-carmine">Tactility & Solitude</span>
              </h2>
            </div>

            <div className="space-y-6 text-slate-gray font-sans font-light leading-relaxed text-sm md:text-base max-w-xl">
              <p>
                Operating from a bamboo studio on the shores of Cox's Bazar, Tanveen structures an ecosystem where the ocean is both the canvas and the medium. Her works discard standard acrylic flatnesses, replacing them with thick, mineralized topographies.
              </p>
              <p>
                By blending hand-harvested sea salt and crushed sandstone directly into acrylic gel matrices, her works act as dynamic visual receptors. As light moves across the room throughout the day, the crystalline fibers refract, shifting from soft coastal fog to golden tides.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setRoute('portfolio')}
                className="group inline-flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine transition-all duration-300 focus:outline-none cursor-pointer"
                id="home-story-biography-btn"
              >
                <span>Observe Her Full Biography</span>
                <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-signature-carmine transition-transform group-hover:translate-x-1 duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


// ==========================================
// 2. Journal Preview Section (Recent Entries)
// ==========================================
export const JournalPreview: React.FC = () => {
  const { setRoute } = useApp();

  // Show the latest 3 entries for a majestic multi-column layout
  const featuredPosts = INITIAL_JOURNAL.slice(0, 3);
  if (featuredPosts.length === 0) return null;

  const leadPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);

  return (
    <section 
      className="relative w-full py-28 bg-[#FCFCFA] paper-texture overflow-hidden border-b border-soft-border text-left"
      id="homepage-journal-preview"
    >
      {/* Decorative vertical guide rails */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-soft-border pb-8 mb-20 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold block">
              Studio Chronicles
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
              The Artist's Journal
            </h2>
            <p className="text-xs text-slate-gray max-w-md font-light leading-relaxed">
              Stories of chemical exploration, landscape sketches, and guidelines for modern collectors.
            </p>
          </div>
          
          <button
            onClick={() => setRoute('journal')}
            className="group text-xs uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine inline-flex items-center space-x-2 transition-all duration-300 focus:outline-none cursor-pointer"
            id="home-journal-directory-btn"
          >
            <span>Explore All Journals</span>
            <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-signature-carmine transition-transform group-hover:translate-x-1 duration-300" />
          </button>
        </div>

        {/* Magazine-Style Layout Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Featured Large Article (takes 7 cols) */}
          <article 
            onClick={() => setRoute('journal-detail', leadPost.id)}
            className="lg:col-span-7 group flex flex-col justify-between space-y-8 cursor-pointer"
            id={`home-journal-post-lead-${leadPost.id}`}
          >
            <div className="space-y-6">
              {/* Cover Image Frame */}
              <div className="aspect-[16/10] bg-[#FAF9F5] border border-soft-border p-3 rounded-xs overflow-hidden relative shadow-[0_12px_40px_rgba(0,0,0,0.01)] group-hover:border-gallery-blue/70 transition-all duration-700">
                <img 
                  src={leadPost.image} 
                  alt={leadPost.title} 
                  className="w-full h-full object-cover rounded-xs group-hover:scale-[1.01] transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-6 left-6 bg-pure-white border border-soft-border text-[8px] uppercase tracking-[0.2em] font-mono font-bold text-slate-gray px-3 py-1 rounded-xs">
                  {leadPost.category}
                </span>
              </div>

              {/* Meta & Title */}
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 text-[9px] text-slate-gray/70 font-mono uppercase tracking-wider">
                  <span>{leadPost.date}</span>
                  <span>•</span>
                  <span>{leadPost.readingTime}</span>
                </div>
                
                <h3 className="font-serif text-3xl font-light text-charcoal-ink leading-tight group-hover:text-signature-carmine transition-colors">
                  {leadPost.title}
                </h3>
                
                <p className="text-slate-gray font-sans font-light leading-relaxed text-sm md:text-base">
                  {leadPost.excerpt}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-soft-border/50 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-charcoal-ink group-hover:text-signature-carmine transition-colors">
              <span>Enter Journal Notes</span>
              <ArrowUpRight className="w-4 h-4 text-gallery-blue group-hover:text-signature-carmine" />
            </div>
          </article>

          {/* Right Column: Supporting Articles Stack (takes 5 cols) */}
          <div className="lg:col-span-5 space-y-12 lg:pl-4">
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-gray/60 font-mono font-bold block pb-3 border-b border-soft-border/50">
              Related Readings & Essays
            </span>
            
            <div className="space-y-12 divide-y divide-soft-border/40">
              {secondaryPosts.map((post, postIdx) => (
                <article 
                  key={post.id}
                  onClick={() => setRoute('journal-detail', post.id)}
                  className={`group flex flex-col gap-6 cursor-pointer text-left ${postIdx > 0 ? 'pt-10' : ''}`}
                  id={`home-journal-post-sub-${post.id}`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Small thumbnail aspect cover */}
                    <div className="w-full sm:w-24 sm:h-24 aspect-[16/10] sm:aspect-square bg-[#FAF9F5] p-2 flex items-center justify-center border border-soft-border rounded-xs overflow-hidden shrink-0 group-hover:border-gallery-blue transition-colors duration-500">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover rounded-xs"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3 text-[8px] text-slate-gray/70 font-mono uppercase tracking-wider">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      
                      <h4 className="font-serif text-lg font-light text-charcoal-ink leading-snug group-hover:text-signature-carmine transition-colors">
                        {post.title}
                      </h4>
                      
                      <p className="text-xs text-slate-gray/80 line-clamp-2 leading-relaxed font-light">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-1 text-[9px] uppercase tracking-widest font-bold text-signature-carmine group-hover:underline">
                    <span>Explore notes</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


// ==========================================
// 3. Testimonials Section (Collector Stories)
// ==========================================
export const Testimonials: React.FC = () => {
  return (
    <section 
      className="relative w-full py-28 bg-canvas-white paper-texture overflow-hidden border-b border-soft-border text-left"
      id="homepage-testimonials"
    >
      {/* Decorative vertical guide rails */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-soft-border/20 hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Block */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-24">
          <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold block">
            The Provenance
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
            Collector Stories
          </h2>
          <div className="w-12 h-[1.5px] bg-signature-carmine mx-auto mt-6" />
          <p className="text-xs text-slate-gray font-light leading-relaxed max-w-md mx-auto mt-4">
            Voices of global collectors who have integrated the tactile coastal narratives of Tanveen's canvas chambers into their living spaces.
          </p>
        </div>

        {/* Testimonials Grid Layout - Sleek cards with deep whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {INITIAL_TESTIMONIALS.map((test) => (
            <div 
              key={test.id}
              className="bg-pure-white border border-soft-border/80 p-8 rounded-xs shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:border-signature-carmine/20 transition-all duration-500 flex flex-col justify-between space-y-10 relative"
              id={`testimonial-card-${test.id}`}
            >
              {/* Elegant Accent Marker */}
              <div className="absolute top-0 left-8 w-6 h-[2px] bg-signature-carmine" />

              <div className="space-y-6">
                <Quote className="w-8 h-8 text-gallery-blue/30 stroke-[1.1]" />
                <p className="text-sm text-charcoal-ink/90 leading-relaxed font-serif italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="border-t border-soft-border/50 pt-6 flex items-center space-x-4">
                {/* Artwork image thumbnail */}
                <div className="w-12 h-12 bg-[#FAF9F5] border border-soft-border rounded-xs shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                  <img 
                    src={test.image} 
                    alt={test.artworkTitle} 
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-left">
                  <p className="text-[11px] font-sans font-bold text-charcoal-ink">{test.collectorName}</p>
                  <p className="text-[9px] font-mono text-slate-gray uppercase tracking-widest mt-0.5">{test.location}</p>
                  <p className="text-[9px] font-sans text-signature-carmine font-semibold mt-1">Acquired: {test.artworkTitle}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
