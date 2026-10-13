/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, ArrowLeft, Calendar, FileText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { trackCollectionView } from '../lib/analytics';

export const CollectionsView: React.FC = () => {
  const { 
    collections, 
    artworks, 
    currentRoute, 
    selectedCollectionId, 
    setRoute 
  } = useApp();

  const isDetailView = currentRoute === 'collection-detail' && selectedCollectionId;
  const activeCollection = collections.find(c => c.id === selectedCollectionId);

  // Track collection view events when they occur
  React.useEffect(() => {
    if (isDetailView && activeCollection) {
      trackCollectionView(activeCollection.id, activeCollection.title);
    }
  }, [isDetailView, activeCollection?.id]);

  // Filter artworks that belong to the active collection
  const collectionArtworks = artworks.filter(
    art => art.collectionId === selectedCollectionId
  );

  if (isDetailView && activeCollection) {
    return (
      <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left" id="collection-detail-page">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Back Action */}
          <button
            onClick={() => setRoute('collections')}
            className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-gray hover:text-signature-carmine mb-12 transition-premium focus:outline-none cursor-pointer"
            id="col-detail-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Return to Anthologies</span>
          </button>

          {/* Exhibition Hero Banner Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 border-b border-soft-border pb-16 text-left">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans">
                  Thematic Exhibition
                </span>
                <span className="w-12 h-[1px] bg-soft-border" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
                The {activeCollection.title} Series
              </h1>
              <p className="text-xs md:text-sm text-slate-gray font-sans font-light leading-relaxed">
                {activeCollection.description}
              </p>
              
              {/* Dynamic Exhibition Story */}
              <div className="bg-[#FAF9F5]/70 border border-soft-border p-6 rounded-xs text-xs text-slate-gray/90 space-y-3 leading-relaxed font-sans">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-charcoal-ink flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-signature-carmine stroke-[1.5]" />
                  <span>Curator's Exhibition Note</span>
                </h4>
                <p className="italic text-charcoal-ink/90 font-light leading-relaxed">
                  "{activeCollection.story}"
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FAF9F5]/70 p-6 border border-soft-border rounded-xs shadow-xs max-w-2xl mx-auto w-full">
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-soft-border/30">
                <img
                  src={activeCollection.coverImage}
                  alt={activeCollection.title}
                  className="w-full h-full object-cover shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Exhibition Artworks Grid */}
          <div className="space-y-10 text-left">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#777777]">Catalogue Index</span>
              <h3 className="font-serif text-2xl font-light text-charcoal-ink tracking-tight">
                Exhibition Catalogue ({collectionArtworks.length})
              </h3>
            </div>

            {collectionArtworks.length === 0 ? (
              <div className="py-16 text-center bg-[#FAF9F5]/40 border border-soft-border rounded-xs font-sans">
                <p className="text-xs text-slate-gray/80">
                  All artworks in this specific collection have been acquired or are being prepared for release.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {collectionArtworks.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setRoute('artwork-detail', art.id)}
                    className="group bg-canvas-white border border-soft-border rounded-xs overflow-hidden shadow-xs hover:shadow-md hover:border-[#CCCCCC] transition-premium flex flex-col cursor-pointer text-left font-sans relative"
                    id={`col-art-card-${art.id}`}
                  >
                    {/* Image frame */}
                    <div className="relative aspect-4/3 bg-[#FAF9F5]/70 p-6 flex items-center justify-center overflow-hidden border-b border-soft-border/40">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {art.isSold && (
                        <div className="absolute inset-0 bg-[#FAF9F6]/60 backdrop-blur-[0.5px] flex items-center justify-center z-10">
                          <span className="bg-canvas-white text-[#777777] font-serif text-[10px] uppercase tracking-[0.25em] px-4 py-2 rounded-xs border border-soft-border/60 shadow-xs">
                            Private Collection
                          </span>
                        </div>
                      )}

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-[#FAF9F6]/95 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-premium flex flex-col items-center justify-center p-6 gap-4 z-20">
                        <div className="text-center space-y-1">
                          <span className="text-[8px] uppercase tracking-[0.25em] font-mono text-slate-gray/80 block">Catalog No. {art.id}</span>
                          <h4 className="font-serif text-lg font-light text-charcoal-ink">"{art.title}"</h4>
                          <p className="text-[9px] text-slate-gray/70">{art.year}</p>
                        </div>
                        <button
                          onClick={() => setRoute('artwork-detail', art.id)}
                          className="bg-signature-carmine text-canvas-white px-5 py-2 rounded-xs text-[9px] uppercase tracking-widest font-bold hover:bg-charcoal-ink transition-premium cursor-pointer"
                        >
                          Observe Story
                        </button>
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-serif text-lg text-charcoal-ink group-hover:text-signature-carmine transition-colors truncate">
                            {art.title}
                          </h4>
                          <span className="font-serif text-xs font-medium text-charcoal-ink/85 tracking-wide shrink-0">
                            ${art.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#777777] font-mono uppercase tracking-widest">{art.medium}</p>
                      </div>

                      <div className="border-t border-soft-border/50 mt-4 pt-3 flex items-center justify-between text-[9px] text-slate-gray font-mono uppercase tracking-wider">
                        <span>Format: {art.size}</span>
                        <span className="text-signature-carmine font-sans font-bold uppercase tracking-widest group-hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    );
  }

  // STANDARD COLLECTIONS OVERVIEW
  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left" id="collections-overview">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Heading */}
        <div className="border-b border-soft-border pb-8 mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block mb-2">
            Visual Anthologies
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
            Thematic Exhibitions
          </h2>
          <p className="text-xs md:text-sm text-slate-gray max-w-xl font-sans font-light mt-3 leading-relaxed">
            Each collection represents a curated series, dedicated to an aesthetic theme, natural phenomenon, or philosophical meditation explored by the studio.
          </p>
        </div>

        {/* Collections Stack cards */}
        <div className="space-y-12">
          {collections.map((col, idx) => {
            const count = artworks.filter(art => art.collectionId === col.id).length;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={col.id}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 border-b border-soft-border/40 pb-16 last:border-0 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
                id={`col-card-${col.id}`}
              >
                {/* Collection Cover Art Frame */}
                <div 
                  onClick={() => setRoute('collection-detail', col.id)}
                  className="w-full lg:w-1/2 bg-[#FAF9F5]/70 p-6 border border-soft-border rounded-xs hover:border-[#CCCCCC] transition-premium cursor-pointer overflow-hidden group shadow-xs"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xs bg-[#FAF9F5]/30">
                    <img
                      src={col.coverImage}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-[1200ms] ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Collection Meta and Story Narrative */}
                <div className="w-full lg:w-1/2 space-y-5 text-left">
                  <div className="flex items-center space-x-2.5 font-mono text-[9px] text-[#777777] uppercase tracking-widest">
                    <span className="text-signature-carmine font-bold">Anthology {idx + 1}</span>
                    <span>•</span>
                    <span>{count} Catalogued Works</span>
                  </div>
                  
                  <h3 
                    onClick={() => setRoute('collection-detail', col.id)}
                    className="font-serif text-3xl md:text-4xl font-light text-charcoal-ink hover:text-signature-carmine transition-premium cursor-pointer tracking-tight"
                  >
                    The {col.title} Series
                  </h3>
                  
                  <p className="text-xs md:text-sm text-slate-gray leading-relaxed font-sans font-light">
                    {col.description}
                  </p>

                  <div className="pt-4 flex items-center space-x-6">
                    <button
                      onClick={() => setRoute('collection-detail', col.id)}
                      className="px-6 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[10px] uppercase tracking-widest font-bold rounded-xs transition-premium flex items-center space-x-2 cursor-pointer focus:outline-none"
                      id={`col-btn-enter-${col.id}`}
                    >
                      <span>Observe Exhibition</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>

                    <button
                      onClick={() => {
                        setRoute('shop');
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-slate-gray hover:text-signature-carmine transition-premium flex items-center space-x-1 cursor-pointer focus:outline-none"
                    >
                      <span>Browse Artworks</span>
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
