/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Exhibition photos (optimized copies of /Media Files originals). Mixed orientations
// are intentional: the row is top-aligned so the varied heights read as a gallery wall.
const EXHIBITION_PHOTOS = [
  { src: '/gallery/exhibition-wall.jpg', alt: 'Four of Tanveen’s framed paintings hung in a row at the exhibition' },
  { src: '/gallery/red-bloom.jpg', alt: 'Framed painting of a red bloom on the gallery wall' },
  { src: '/gallery/ocean-whisper-framed.jpg', alt: 'Framed blue abstract painting on the gallery wall' },
  { src: '/gallery/pair-installation.jpg', alt: 'Two framed paintings hung side by side' },
  { src: '/gallery/hourglass.jpg', alt: 'Framed painting of an hourglass resting on a green leaf' },
  { src: '/gallery/crowned-vessel.jpg', alt: 'Framed painting of a crowned checkered vessel' },
];

export const HomeHero: React.FC = () => {
  const { setRoute } = useApp();

  return (
    <section className="w-full bg-canvas-white pt-10 md:pt-16 pb-20 md:pb-28" id="home-hero" aria-labelledby="home-hero-title">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Title row: label left, oversized name right, closed by a full-width rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-6 pb-5 border-b border-charcoal-ink">
          <div>
            <button
              onClick={() => setRoute('portfolio')}
              className="text-[11px] font-sans font-medium text-charcoal-ink border border-charcoal-ink rounded-[3px] px-2.5 py-1 hover:bg-artveen-plum hover:border-artveen-plum hover:text-white transition-colors cursor-pointer"
              id="home-hero-about-btn"
            >
              About
            </button>
          </div>
          <motion.h1
            id="home-hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-medium text-artveen-plum! text-6xl sm:text-7xl lg:text-8xl xl:text-[8.5rem] leading-[0.9] tracking-[-0.03em]"
          >
            Artveen
          </motion.h1>
        </div>

        {/* Statement row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 pt-8 md:pt-10">
          <p className="font-sans text-lg md:text-xl leading-snug text-charcoal-ink max-w-xs">
            Art Escape by Tanveen — a quiet room for paintings that hold a story.
          </p>
          <div className="space-y-6">
            <p className="font-sans text-lg md:text-xl leading-snug text-charcoal-ink max-w-xl">
              Original paintings by Tanveen: layered, textured canvases exploring memory, nature and the inner landscape. Collect an original or a signed limited print, each shared with the story behind it.
            </p>
            <button
              onClick={() => setRoute('shop')}
              className="inline-flex items-center gap-2 bg-artveen-plum text-white text-sm font-sans font-medium px-5 py-2.5 rounded-[4px] hover:bg-artveen-red transition-colors cursor-pointer group"
              id="home-hero-explore-btn"
            >
              <span>Explore the Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Exhibition strip: equal columns, natural heights, top-aligned */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-start gap-4 md:gap-6 pt-12 md:pt-14">
          {EXHIBITION_PHOTOS.map((photo, i) => (
            <motion.button
              key={photo.src}
              onClick={() => setRoute('shop')}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="block w-full overflow-hidden bg-soft-border/40 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-artveen-gold"
              aria-label={`${photo.alt} — open the gallery`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i < 3 ? 'eager' : 'lazy'}
                className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
};
