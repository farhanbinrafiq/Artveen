/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Heart, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LivingGallery: React.FC = () => {
  const { artworks, wishlist, toggleWishlist, setRoute } = useApp();
  
  // Filter featured artworks for the cinematic slide
  const featuredArt = artworks.filter(art => art.featured);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeArtwork = featuredArt[currentIdx] || artworks[0];

  const handleNext = () => {
    if (featuredArt.length === 0) return;
    setDirection(1);
    setCurrentIdx((prev) => (prev + 1) % featuredArt.length);
  };

  const handlePrev = () => {
    if (featuredArt.length === 0) return;
    setDirection(-1);
    setCurrentIdx((prev) => (prev - 1 + featuredArt.length) % featuredArt.length);
  };

  // Handle mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Enable keyboard left/right arrow keys to traverse the gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [featuredArt.length]);

  if (featuredArt.length === 0) return null;

  const isLiked = wishlist.includes(activeArtwork.id);

  // Motion variants for cinematic transitions
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 100 : -100,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        opacity: { duration: 0.8, ease: 'easeInOut' },
        x: { duration: 0.8, ease: 'easeOut' },
        scale: { duration: 1.0, ease: 'easeOut' }
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -100 : 100,
      scale: 1.02,
      transition: {
        opacity: { duration: 0.6, ease: 'easeInOut' },
        x: { duration: 0.6, ease: 'easeIn' }
      }
    })
  };

  return (
    <section 
      className="relative w-full min-h-[95vh] flex flex-col justify-center bg-canvas-white paper-texture pt-28 pb-16 overflow-hidden border-b border-soft-border"
      id="living-gallery-section"
    >
      {/* Decorative vertical rails inspired by modern art museums */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-soft-border/30 hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-soft-border/30 hidden xl:block" />

      {/* Subtle background glow mimicking gallery wash-lights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gallery-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-studio-mist/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Left Side: Emotional Narrative Card - Luxurious & Airy */}
        <div className="lg:col-span-5 flex flex-col justify-center py-6 z-10 space-y-10 text-left">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeArtwork.id}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              className="space-y-10"
              id={`slide-info-${activeArtwork.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-signature-carmine rounded-full animate-pulse" />
                  <span className="uppercase text-[9px] tracking-[0.4em] font-bold text-signature-carmine font-sans">
                    The Living Gallery™
                  </span>
                  <span className="text-[10px] font-mono text-slate-gray/50 ml-auto tracking-wider">
                    EXH {currentIdx + 1} of {featuredArt.length}
                  </span>
                </div>
                
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight text-charcoal-ink">
                  {activeArtwork.title}
                </h1>

                {activeArtwork.locationInspiration && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-gray/70 font-mono font-bold">
                    Inspiration — <span className="text-charcoal-ink">{activeArtwork.locationInspiration}</span>
                  </p>
                )}
              </div>

              {/* Story Teaser with high letter-spacing and nice leading */}
              <p className="text-slate-gray text-base md:text-lg leading-relaxed font-serif font-light italic border-l border-gallery-blue/60 pl-4">
                "{activeArtwork.description}"
              </p>

              {/* Ambient handwritten quote layer - refined */}
              {activeArtwork.handwrittenNote && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-studio-mist/25 border border-soft-border/50 rounded-xs font-serif text-sm text-charcoal-ink/95 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                  id="artist-handwritten-note-card"
                >
                  <p className="font-serif leading-relaxed italic text-charcoal-ink">"{activeArtwork.handwrittenNote}"</p>
                  <p className="text-right text-[8px] uppercase tracking-[0.25em] font-sans font-bold text-slate-gray/60 mt-3">
                    — Tanveen, Studio Journal
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <button
                  onClick={() => setRoute('artwork-detail', activeArtwork.id)}
                  className="bg-charcoal-ink text-canvas-white hover:bg-signature-carmine px-8 py-4 rounded-xs font-bold tracking-widest uppercase text-[10px] font-sans transition-all duration-300 flex items-center space-x-2.5 cursor-pointer focus:outline-none shadow-xs"
                  id="slide-explore-details"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Observe Provenance</span>
                </button>
                
                <button
                  onClick={() => setRoute('collections')}
                  className="text-charcoal-ink border-b border-charcoal-ink/40 pb-1 font-bold tracking-widest uppercase text-[10px] font-sans hover:text-signature-carmine hover:border-signature-carmine transition-all duration-300 cursor-pointer focus:outline-none"
                >
                  Exhibition Anthology
                </button>

                <button
                  onClick={() => toggleWishlist(activeArtwork.id)}
                  className={`p-4 rounded-xs border transition-all duration-300 cursor-pointer focus:outline-none ml-auto ${
                    isLiked 
                      ? 'bg-signature-carmine/10 text-signature-carmine border-signature-carmine/30' 
                      : 'bg-pure-white text-slate-gray border-soft-border hover:border-signature-carmine hover:text-signature-carmine'
                  }`}
                  id="slide-toggle-wishlist"
                  title="Add to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-signature-carmine' : ''}`} />
                </button>
              </div>

              {/* Technical Details Grid */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-soft-border/50">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-gray font-mono font-semibold mb-1">Medium</span>
                  <span className="text-xs font-serif italic text-charcoal-ink">{activeArtwork.medium}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-gray font-mono font-semibold mb-1">Dimensions</span>
                  <span className="text-xs font-serif italic text-charcoal-ink">{activeArtwork.size}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-gray font-mono font-semibold mb-1">Provenance</span>
                  <span className="text-xs font-serif italic text-charcoal-ink">
                    {activeArtwork.isOriginal ? 'Original Canvas' : 'Limited Giclée'}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Immersive Asymmetrical Canvas Display (takes 7 columns to dominate) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative z-0">
          
          {/* Fixed-height stage keeps the layout steady; the frame itself hugs each artwork's own proportions */}
          <div
            className="relative w-full h-[60vh] min-h-[420px] lg:h-[72vh] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setRoute('artwork-detail', activeArtwork.id)}
            id="cinematic-canvas-frame"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeArtwork.id}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={slideVariants}
                className="w-full h-full flex items-center justify-center relative z-0"
              >
                {/* Gallery frame: white mat, inset gold rule, soft plum shadow — no empty canvas around the art */}
                <div
                  className="relative max-w-full max-h-full bg-white p-2.5 sm:p-3 ring-1 ring-artveen-plum/10 shadow-[0_28px_60px_rgba(52,22,57,0.22)] transition-transform duration-[2s] ease-out"
                  style={{ transform: isHovered ? 'scale(1.015)' : 'scale(1)' }}
                >
                  {/* Elegant Sold Tag Overlay */}
                  {activeArtwork.isSold && (
                    <div className="absolute top-6 left-6 z-20 bg-charcoal-ink text-canvas-white px-4 py-1.5 rounded-xs text-[9px] font-sans font-bold uppercase tracking-widest flex items-center space-x-2 shadow-sm border border-canvas-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-signature-carmine animate-pulse" />
                      <span>Acquired</span>
                    </div>
                  )}
                  <img
                    src={activeArtwork.image}
                    alt={activeArtwork.title}
                    className="block w-auto h-auto max-w-full max-h-[calc(60vh-1.5rem)] lg:max-h-[calc(72vh-1.5rem)] outline outline-1 outline-artveen-gold/60"
                    referrerPolicy="no-referrer"
                    id={`slide-canvas-img-${activeArtwork.id}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Navigation Triggers (Refined museum indexer style) */}
          <div className="w-full flex justify-between items-center mt-8 text-[9px] tracking-[0.4em] uppercase font-bold text-slate-gray">
            <button 
              onClick={handlePrev} 
              className="flex items-center gap-2 cursor-pointer hover:text-signature-carmine transition-colors focus:outline-none p-3 -m-3"
              id="slide-nav-prev"
            >
              <span>Prev</span>
            </button>
            
            <div className="flex items-center gap-6">
              <span>{String(currentIdx + 1).padStart(2, '0')}</span>
              <div className="w-24 h-[1px] bg-soft-border relative">
                <div 
                  className="absolute h-[1.5px] bg-charcoal-ink transition-all duration-700" 
                  style={{ 
                    width: `${(1 / featuredArt.length) * 100}%`,
                    left: `${(currentIdx / featuredArt.length) * 100}%` 
                  }} 
                />
              </div>
              <span>{String(featuredArt.length).padStart(2, '0')}</span>
            </div>

            <button 
              onClick={handleNext} 
              className="flex items-center gap-2 cursor-pointer hover:text-signature-carmine transition-colors focus:outline-none p-3 -m-3"
              id="slide-nav-next"
            >
              <span>Next</span>
            </button>
          </div>

          {/* Floating 'Established 2026' text layout */}
          <div className="absolute top-0 -right-8 flex items-center gap-4 pointer-events-none hidden xl:flex">
            <div className="w-[1px] h-12 bg-soft-border"></div>
            <span className="font-serif text-[9px] tracking-widest uppercase rotate-90 origin-left whitespace-nowrap translate-y-3 text-slate-gray/70">
              Established 2026
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
