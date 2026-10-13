/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Artwork } from '../types';
import { SlidersHorizontal, Grid, List, Heart, Search, Eye, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackSearch } from '../lib/analytics';

export const ShopGallery: React.FC = () => {
  const { artworks, wishlist, toggleWishlist, setRoute, searchQuery, setSearchQuery } = useApp();

  // Filters state
  const [activeTheme, setActiveTheme] = useState<string>('all');
  const [activeMedium, setActiveMedium] = useState<string>('all'); // all, original, print
  const [activeOrientation, setActiveOrientation] = useState<string>('all');
  const [activeAvailability, setActiveAvailability] = useState<string>('all'); // all, available, sold
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewStyle, setViewStyle] = useState<'grid' | 'masonry'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Extract unique filters from state dynamically
  const themes = useMemo(() => {
    const set = new Set(artworks.map(art => art.theme));
    return ['all', ...Array.from(set)];
  }, [artworks]);

  // Combined search & filter evaluation
  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    // 1. Theme Filter
    if (activeTheme !== 'all') {
      result = result.filter(art => art.theme.toLowerCase() === activeTheme.toLowerCase());
    }

    // 2. Medium Filter
    if (activeMedium === 'original') {
      result = result.filter(art => art.isOriginal);
    } else if (activeMedium === 'print') {
      result = result.filter(art => art.printsAvailable);
    }

    // 3. Orientation Filter
    if (activeOrientation !== 'all') {
      result = result.filter(art => art.orientation === activeOrientation);
    }

    // 4. Availability Filter
    if (activeAvailability === 'available') {
      result = result.filter(art => !art.isSold);
    } else if (activeAvailability === 'sold') {
      result = result.filter(art => art.isSold);
    }

    // 5. Text Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(art => 
        art.title.toLowerCase().includes(query) ||
        art.medium.toLowerCase().includes(query) ||
        art.theme.toLowerCase().includes(query) ||
        art.description.toLowerCase().includes(query)
      );
    }

    // 6. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.year.localeCompare(a.year));
    }

    return result;
  }, [artworks, activeTheme, activeMedium, activeOrientation, activeAvailability, searchQuery, sortBy]);

  // Debounced search query tracking
  useEffect(() => {
    if (searchQuery.trim() === '') return;
    const delay = setTimeout(() => {
      trackSearch(searchQuery, filteredArtworks.length);
    }, 1000);
    return () => clearTimeout(delay);
  }, [searchQuery, filteredArtworks.length]);

  const handleResetFilters = () => {
    setActiveTheme('all');
    setActiveMedium('all');
    setActiveOrientation('all');
    setActiveAvailability('all');
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24" id="shop-gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Editorial Heading Section */}
        <div className="border-b border-soft-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Curated Acquisitions
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
              The Studio Gallery
            </h2>
            <p className="text-xs md:text-sm text-slate-gray max-w-xl font-sans font-light leading-relaxed">
              Acquire certified original canvases textured with Cox’s Bazar sea salt, or select highly limited signed archival prints stretched on premium Belgian linen.
            </p>
          </div>
          
          {/* Layout & Quick Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold font-sans px-5 py-3 border border-soft-border rounded-xs hover:border-signature-carmine hover:text-signature-carmine transition-premium bg-pure-white shadow-xs cursor-pointer focus:outline-none"
              id="filter-sidebar-trigger"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-gray stroke-[1.5]" />
              <span>Exhibition Index ({filteredArtworks.length})</span>
            </button>

            <div className="hidden sm:flex items-center border border-soft-border rounded-xs p-1 bg-pure-white">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-2 rounded-xs transition-premium cursor-pointer ${viewStyle === 'grid' ? 'bg-charcoal-ink text-canvas-white' : 'text-[#777777] hover:text-charcoal-ink'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => setViewStyle('masonry')}
                className={`p-2 rounded-xs transition-premium cursor-pointer ${viewStyle === 'masonry' ? 'bg-charcoal-ink text-canvas-white' : 'text-[#777777] hover:text-charcoal-ink'}`}
                title="Masonry Gallery View"
              >
                <List className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mb-12" id="shop-search-container">
          <input
            type="text"
            placeholder="Search Curated Catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-pure-white border border-soft-border rounded-xs py-3.5 pl-12 pr-12 text-base md:text-xs font-sans focus:outline-none focus:border-signature-carmine transition-premium shadow-xs"
          />
          <Search className="w-[18px] h-[18px] text-[#777777]/80 absolute left-4 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-signature-carmine font-bold cursor-pointer focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sidebar Filters Drawer / Expandable Area */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border border-soft-border rounded-xs bg-pure-white p-6 md:p-8 mb-12 shadow-xs font-sans text-left"
              id="expanded-filter-panel"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                
                {/* 1. Theme Selector */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-bold font-mono">
                    Art Theme
                  </h4>
                  <div className="flex flex-col space-y-1.5">
                    {themes.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setActiveTheme(theme)}
                        className={`text-left text-xs py-2.5 md:py-1 hover:text-signature-carmine transition-premium capitalize flex items-center gap-2 cursor-pointer focus:outline-none ${activeTheme === theme ? 'text-signature-carmine font-bold' : 'text-slate-gray/80'}`}
                      >
                        {activeTheme === theme && <span className="w-1 h-1 rounded-full bg-signature-carmine shrink-0" />}
                        <span>{theme === 'all' ? 'All Anthologies' : theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Medium Type */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-bold font-mono">
                    Medium
                  </h4>
                  <div className="flex flex-col space-y-1.5">
                    {[
                      { key: 'all', label: 'All Artworks' },
                      { key: 'original', label: 'Original Canvas' },
                      { key: 'print', label: 'Limited Editions / Prints' }
                    ].map(med => (
                      <button
                        key={med.key}
                        onClick={() => setActiveMedium(med.key)}
                        className={`text-left text-xs py-2.5 md:py-1 hover:text-signature-carmine transition-premium flex items-center gap-2 cursor-pointer focus:outline-none ${activeMedium === med.key ? 'text-signature-carmine font-bold' : 'text-slate-gray/80'}`}
                      >
                        {activeMedium === med.key && <span className="w-1 h-1 rounded-full bg-signature-carmine shrink-0" />}
                        <span>{med.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Orientation */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-bold font-mono">
                    Orientation
                  </h4>
                  <div className="flex flex-col space-y-1.5">
                    {[
                      { key: 'all', label: 'Any Format' },
                      { key: 'portrait', label: 'Portrait' },
                      { key: 'landscape', label: 'Landscape' },
                      { key: 'square', label: 'Square' }
                    ].map(ort => (
                      <button
                        key={ort.key}
                        onClick={() => setActiveOrientation(ort.key)}
                        className={`text-left text-xs py-2.5 md:py-1 hover:text-signature-carmine transition-premium flex items-center gap-2 cursor-pointer focus:outline-none ${activeOrientation === ort.key ? 'text-signature-carmine font-bold' : 'text-slate-gray/80'}`}
                      >
                        {activeOrientation === ort.key && <span className="w-1 h-1 rounded-full bg-signature-carmine shrink-0" />}
                        <span>{ort.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Availability */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-bold font-mono">
                    Status
                  </h4>
                  <div className="flex flex-col space-y-1.5">
                    {[
                      { key: 'all', label: 'All Statuses' },
                      { key: 'available', label: 'Available (For Sale)' },
                      { key: 'sold', label: 'Acquired' }
                    ].map(stat => (
                      <button
                        key={stat.key}
                        onClick={() => setActiveAvailability(stat.key)}
                        className={`text-left text-xs py-2.5 md:py-1 hover:text-signature-carmine transition-premium flex items-center gap-2 cursor-pointer focus:outline-none ${activeAvailability === stat.key ? 'text-signature-carmine font-bold' : 'text-slate-gray/80'}`}
                      >
                        {activeAvailability === stat.key && <span className="w-1 h-1 rounded-full bg-signature-carmine shrink-0" />}
                        <span>{stat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Sort By */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-bold font-mono">
                    Sort Index
                  </h4>
                  <div className="flex flex-col space-y-1.5">
                    {[
                      { key: 'featured', label: 'Featured Curated' },
                      { key: 'newest', label: 'Newest Releases' },
                      { key: 'price-asc', label: 'Value: Low to High' },
                      { key: 'price-desc', label: 'Value: High to Low' },
                      { key: 'title-asc', label: 'Alphabetical: A-Z' }
                    ].map(srt => (
                      <button
                        key={srt.key}
                        onClick={() => setSortBy(srt.key)}
                        className={`text-left text-xs py-2.5 md:py-1 hover:text-signature-carmine transition-premium flex items-center gap-2 cursor-pointer focus:outline-none ${sortBy === srt.key ? 'text-signature-carmine font-bold' : 'text-slate-gray/80'}`}
                      >
                        {sortBy === srt.key && <span className="w-1 h-1 rounded-full bg-signature-carmine shrink-0" />}
                        <span>{srt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reset trigger */}
              <div className="mt-8 pt-4 border-t border-soft-border/50 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] uppercase tracking-widest font-bold text-charcoal-ink hover:text-signature-carmine underline flex items-center space-x-1.5 cursor-pointer focus:outline-none"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>Reset All Active Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredArtworks.length === 0 && (
          <div className="flex flex-col justify-center items-center text-center py-24 bg-pure-white border border-soft-border rounded-xs p-8 shadow-xs">
            <FilterX className="w-12 h-12 text-gallery-blue stroke-[1.2] mb-4" />
            <h4 className="font-serif text-lg font-light text-charcoal-ink mb-2">No artwork matched your search.</h4>
            <p className="text-xs text-slate-gray/85 max-w-sm mb-6 font-sans leading-relaxed">
              Try another keyword or browse our curated collections.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-8 py-3 bg-charcoal-ink text-canvas-white text-[10px] uppercase tracking-widest font-bold rounded-xs hover:bg-signature-carmine transition-premium cursor-pointer focus:outline-none"
            >
              Show All Collections
            </button>
          </div>
        )}

        {/* Master Gallery Layout Renderer */}
        <AnimatePresence mode="popLayout">
          {viewStyle === 'grid' ? (
            /* STANDARD BEAUTIFUL CARD GRID */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 text-left"
              id="shop-grid-layout"
            >
              {filteredArtworks.map((art) => {
                const isLiked = wishlist.includes(art.id);
                return (
                  <motion.div
                    key={art.id}
                    layoutId={`art-card-${art.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group bg-canvas-white rounded-xs border border-soft-border overflow-hidden shadow-xs hover:shadow-md hover:border-[#CCCCCC] transition-premium flex flex-col relative"
                    id={`art-card-item-${art.id}`}
                  >
                    {/* Artwork Container Frame */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#FAF9F5]/70 p-6 flex items-center justify-center border-b border-soft-border/40">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      
                      {/* Sold Overlay Indicator */}
                      {art.isSold && (
                        <div className="absolute inset-0 bg-[#FAF9F6]/60 backdrop-blur-[0.5px] flex items-center justify-center z-10">
                          <span className="bg-canvas-white text-[#777777] font-serif text-[10px] uppercase tracking-[0.25em] px-4 py-2 rounded-xs border border-soft-border/60 shadow-xs">
                            Private Collection
                          </span>
                        </div>
                      )}
 
                      {/* Floating Category Tag */}
                      <span className="absolute top-4 left-4 bg-pure-white border border-soft-border/80 text-[8px] uppercase font-mono tracking-widest text-slate-gray px-2.5 py-1 rounded-xs shadow-xs font-bold">
                        {art.theme}
                      </span>
 
                      {/* Premium Interactive Overlay */}
                      <div className="absolute inset-0 bg-[#FAF9F6]/95 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-premium flex flex-col items-center justify-center p-6 gap-5 z-20">
                        <div className="text-center space-y-1">
                          <span className="text-[8px] uppercase tracking-[0.25em] font-mono text-slate-gray/80 block">Catalog No. {art.id}</span>
                          <h4 className="font-serif text-lg font-light text-charcoal-ink">"{art.title}"</h4>
                          <p className="text-[10px] text-slate-gray/70">{art.year} • {art.theme}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setRoute('artwork-detail', art.id)}
                            className="bg-signature-carmine text-canvas-white px-5 py-2.5 rounded-xs text-[9px] uppercase tracking-widest font-bold hover:bg-charcoal-ink transition-premium cursor-pointer focus:outline-none"
                          >
                            Observe Story
                          </button>
                          <button
                            onClick={() => toggleWishlist(art.id)}
                            className="w-9 h-9 rounded-xs border border-soft-border bg-pure-white flex items-center justify-center text-slate-gray hover:text-signature-carmine hover:border-signature-carmine transition-premium cursor-pointer focus:outline-none"
                            title="Add to Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-signature-carmine text-signature-carmine' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
 
                    {/* Meta information card footer */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left font-sans">
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 
                            onClick={() => setRoute('artwork-detail', art.id)}
                            className="font-serif text-lg text-charcoal-ink hover:text-signature-carmine transition-colors cursor-pointer"
                          >
                            {art.title}
                          </h3>
                          <span className="font-serif text-xs text-charcoal-ink/80 shrink-0 font-medium tracking-wide">
                            ${art.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-gray/70 font-mono tracking-widest uppercase">{art.medium}</p>
                        <p className="text-[11px] text-slate-gray/80 italic line-clamp-2 mt-2 leading-relaxed">
                          "{art.description}"
                        </p>
                      </div>
 
                      <div className="border-t border-soft-border/50 mt-4 pt-4 flex items-center justify-between text-[9px] text-slate-gray font-mono">
                        <span>Format: {art.size}</span>
                        {art.printsAvailable ? (
                          <span className="text-signature-carmine font-sans font-bold uppercase tracking-widest">
                            Signed Prints Available
                          </span>
                        ) : (
                          <span className="text-[#999999]/60 font-sans font-bold uppercase tracking-widest">
                            Unique Piece
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* MASONRY LUXURY ART GALLERY LAYOUT */
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 text-left"
              id="shop-masonry-layout"
            >
              {filteredArtworks.map((art) => {
                const isLiked = wishlist.includes(art.id);
                // Dynamically establish diverse aspect containers in masonry to present rhythm
                const aspectClass = art.orientation === 'portrait' 
                  ? 'aspect-3/4' 
                  : art.orientation === 'square' 
                    ? 'aspect-square' 
                    : 'aspect-3/2';
                
                return (
                  <motion.div
                    key={art.id}
                    layoutId={`art-card-${art.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="break-inside-avoid bg-canvas-white rounded-xs border border-soft-border overflow-hidden shadow-xs hover:shadow-md hover:border-[#CCCCCC] transition-premium flex flex-col relative mb-8 group"
                    id={`art-masonry-item-${art.id}`}
                  >
                    {/* Visual Media Container */}
                    <div className={`relative ${aspectClass} overflow-hidden bg-[#FAF9F5]/70 p-6 flex items-center justify-center border-b border-soft-border/40`}>
                      <img
                        src={art.image}
                        alt={art.title}
                        className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      
                      {art.isSold && (
                        <div className="absolute inset-0 bg-[#FAF9F6]/60 backdrop-blur-[0.5px] flex items-center justify-center z-10">
                          <span className="bg-canvas-white text-[#777777] font-serif text-[10px] uppercase tracking-[0.25em] px-4 py-2 rounded-xs border border-soft-border/60 shadow-xs">
                            Private Collection
                          </span>
                        </div>
                      )}
                      
                      {/* Premium Interactive Overlay */}
                      <div className="absolute inset-0 bg-[#FAF9F6]/95 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-premium flex flex-col items-center justify-center p-6 gap-5 z-20">
                        <div className="text-center space-y-1">
                          <span className="text-[8px] uppercase tracking-[0.25em] font-mono text-slate-gray/80 block">Catalog No. {art.id}</span>
                          <h4 className="font-serif text-lg font-light text-charcoal-ink">"{art.title}"</h4>
                          <p className="text-[10px] text-slate-gray/70">{art.year} • {art.theme}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setRoute('artwork-detail', art.id)}
                            className="bg-signature-carmine text-canvas-white px-5 py-2.5 rounded-xs text-[9px] uppercase tracking-widest font-bold hover:bg-charcoal-ink transition-premium cursor-pointer focus:outline-none"
                          >
                            Observe Story
                          </button>
                          <button
                            onClick={() => toggleWishlist(art.id)}
                            className="w-9 h-9 rounded-xs border border-soft-border bg-pure-white flex items-center justify-center text-slate-gray hover:text-signature-carmine hover:border-signature-carmine transition-premium cursor-pointer focus:outline-none"
                            title="Add to Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-signature-carmine text-signature-carmine' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-5 text-left font-sans space-y-2">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[#777777] font-mono font-bold block">
                        {art.theme} • {art.year}
                      </span>
                      <h3 
                        onClick={() => setRoute('artwork-detail', art.id)}
                        className="font-serif text-lg font-light text-charcoal-ink hover:text-signature-carmine transition-colors cursor-pointer"
                      >
                        {art.title}
                      </h3>
                      <p className="text-[10px] text-slate-gray/70 font-mono uppercase tracking-wider">{art.medium}</p>
                      
                      <div className="border-t border-soft-border/50 pt-4 mt-4 flex items-center justify-between text-xs">
                        <span className="font-serif font-medium text-charcoal-ink/80 text-sm tracking-wide">
                          ${art.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setRoute('artwork-detail', art.id)}
                          className="text-[9px] uppercase font-bold tracking-[0.15em] text-signature-carmine hover:underline flex items-center cursor-pointer focus:outline-none"
                        >
                          <span>Exhibition Story</span>
                          <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
