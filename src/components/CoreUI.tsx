/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Artwork, Collection, JournalPost, Artist } from '../types';
import { Search, SlidersHorizontal, ArrowRight, X, Heart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaService } from '../services/MediaService';

/**
 * Standard dynamic Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-sans font-bold uppercase tracking-[0.15em] transition-premium focus:outline-none focus:ring-1 focus:ring-signature-carmine focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#1C1C1C] text-canvas-white hover:bg-signature-carmine hover:shadow-xs",
    secondary: "bg-studio-mist border border-soft-border text-charcoal-ink hover:bg-canvas-white hover:border-[#1C1C1C]",
    outline: "border border-soft-border text-charcoal-ink hover:bg-charcoal-ink hover:text-canvas-white hover:border-charcoal-ink",
    minimal: "bg-transparent text-slate-gray hover:text-signature-carmine tracking-[0.2em] px-0"
  };

  const sizes = {
    sm: "text-[9px] px-4 py-2.5 rounded-lg",
    md: "text-[10px] px-6 py-3.5 rounded-xl",
    lg: "text-xs px-8 py-4.5 rounded-xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * High-Tactility Badge
 */
export const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'mist' | 'blue' | 'carmine' | 'mono';
}> = ({ children, variant = 'mist' }) => {
  const styles = {
    mist: "bg-studio-mist text-charcoal-ink border border-soft-border",
    blue: "bg-[#C4D8E2]/25 text-[#4A6B82] border border-[#C4D8E2]/50",
    carmine: "bg-signature-carmine/10 text-signature-carmine border border-signature-carmine/20",
    mono: "bg-charcoal-ink text-canvas-white"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest rounded-full font-bold ${styles[variant]}`}>
      {children}
    </span>
  );
};

/**
 * Minimalist Tag
 */
export const Tag: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ 
  children, 
  active = false,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`px-3 py-1 text-[10px] font-mono tracking-wider transition-all duration-200 rounded-md focus:outline-none ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      } ${
        active 
          ? 'bg-[#1C1C1C] text-canvas-white' 
          : 'bg-[#F9F9F9] text-slate-gray hover:bg-[#F0F0F0]'
      }`}
    >
      #{children}
    </button>
  );
};

/**
 * Editorial Section Shell
 */
export interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'mist' | 'dark';
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  background = 'white', 
  children, 
  className = '' 
}) => {
  const bgStyles = {
    white: "bg-canvas-white",
    mist: "bg-studio-mist/40 border-y border-soft-border",
    dark: "bg-[#1C1C1C] text-canvas-white border-y border-soft-border/20"
  };

  return (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-12 transition-all duration-300 ${bgStyles[background]} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="mb-12 md:mb-16 max-w-2xl">
            {subtitle && (
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-signature-carmine mb-3">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-charcoal-ink leading-tight">
                {title}
              </h2>
            )}
            <div className="w-12 h-[2px] bg-[#1C1C1C] mt-6" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

/**
 * CMS Driven Hero block
 */
export interface HeroProps {
  title: string;
  subtitle?: string;
  height?: 'small' | 'medium' | 'large' | 'fullscreen';
  backgroundStyle?: 'white' | 'mist' | 'dark' | 'gradient';
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  imageUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  height = 'medium',
  backgroundStyle = 'mist',
  ctaText,
  ctaLink,
  onCtaClick,
  imageUrl
}) => {
  const heightStyles = {
    small: "py-16 md:py-20",
    medium: "py-24 md:py-32",
    large: "py-32 md:py-48",
    fullscreen: "min-h-[85vh] flex items-center"
  };

  const bgStyles = {
    white: "bg-canvas-white border-b border-soft-border",
    mist: "bg-studio-mist/50 border-b border-soft-border",
    dark: "bg-[#1C1C1C] text-canvas-white border-b border-soft-border/25",
    gradient: "bg-gradient-to-br from-studio-mist via-canvas-white to-[#E3EFF5] border-b border-[#C4D8E2]/50"
  };

  return (
    <div className={`relative px-6 md:px-12 overflow-hidden ${heightStyles[height]} ${bgStyles[backgroundStyle]}`}>
      {imageUrl && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src={MediaService.getOptimizedUrl(imageUrl, 'banner')} 
            alt="" 
            className="w-full h-full object-cover filter saturate-50 blur-xs"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] text-signature-carmine mb-4 md:mb-5 font-bold"
          >
            Fine Tactility Editorial Sanctuary
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-charcoal-ink leading-tight md:leading-[1.1]"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-slate-gray font-serif mt-6 md:mt-8 leading-relaxed max-w-2xl"
            >
              {subtitle}
            </motion.p>
          )}
          {ctaText && (onCtaClick || ctaLink) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 md:mt-12"
            >
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onCtaClick}
              >
                {ctaText} <ArrowRight className="w-3.5 h-3.5 ml-2.5 animate-pulse" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Standardized ArtworkCard
 */
export interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: (id: string) => void;
  onWishlistToggle?: (id: string) => void;
  isWishlisted?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onSelect,
  onWishlistToggle,
  isWishlisted = false
}) => {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-canvas-white border border-soft-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
      id={`art-card-${artwork.id}`}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-[#F7F7F7] cursor-pointer" onClick={() => onSelect(artwork.id)}>
        <img 
          src={MediaService.getOptimizedUrl(artwork.image, 'medium')} 
          alt={artwork.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-canvas-white bg-signature-carmine/90 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Eye className="w-3 h-3" /> Inspect original
          </span>
        </div>
        
        {/* Wishlist toggle button */}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(artwork.id);
            }}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-canvas-white/90 backdrop-blur-xs rounded-full flex items-center justify-center border border-soft-border hover:bg-canvas-white shadow-xs hover:scale-105 transition-all duration-200 focus:outline-none cursor-pointer"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-signature-carmine text-signature-carmine' : 'text-slate-gray'}`} />
          </button>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="cursor-pointer" onClick={() => onSelect(artwork.id)}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-gray">
              {artwork.theme}
            </span>
            {artwork.isSold ? (
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#A13A3A] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                Acquired
              </span>
            ) : (
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#3AA17E] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                Available
              </span>
            )}
          </div>
          <h3 className="text-lg font-serif font-bold text-charcoal-ink group-hover:text-signature-carmine transition-colors duration-200">
            {artwork.title}
          </h3>
          <p className="text-xs text-slate-gray font-sans mt-1.5 line-clamp-2">
            {artwork.description}
          </p>
        </div>

        <div className="border-t border-soft-border/50 pt-4 mt-5 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-gray">{artwork.year}</span>
          <span className="text-sm font-sans font-bold text-charcoal-ink">
            ${artwork.price.toLocaleString()} USD
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Standardized CollectionCard
 */
export interface CollectionCardProps {
  collection: Collection;
  onSelect: (id: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onSelect
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-canvas-white border border-soft-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
      onClick={() => onSelect(collection.id)}
      id={`col-card-${collection.id}`}
    >
      <div className="aspect-16/10 overflow-hidden bg-[#F7F7F7]">
        <img 
          src={MediaService.getOptimizedUrl(collection.coverImage, 'medium')} 
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-charcoal-ink group-hover:text-signature-carmine transition-colors duration-200">
            {collection.title}
          </h3>
          <p className="text-xs text-slate-gray font-sans leading-relaxed mt-2.5 line-clamp-3">
            {collection.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-signature-carmine text-[10px] font-mono uppercase tracking-widest mt-6">
          Enter room <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Standardized JournalCard
 */
export interface JournalCardProps {
  post: JournalPost;
  onSelect: (id: string) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  post,
  onSelect
}) => {
  return (
    <motion.article 
      whileHover={{ y: -4 }}
      className="group bg-canvas-white border border-soft-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 p-5 cursor-pointer"
      onClick={() => onSelect(post.id)}
      id={`journal-card-${post.id}`}
    >
      <div className="w-full md:w-1/3 aspect-16/10 md:aspect-square overflow-hidden bg-[#F7F7F7] rounded-xl shrink-0">
        <img 
          src={MediaService.getOptimizedUrl(post.image, 'medium')} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-signature-carmine font-bold bg-signature-carmine/5 px-2.5 py-1 rounded-md">
              {post.category}
            </span>
            <span className="text-[10px] font-mono text-slate-gray">{post.date}</span>
          </div>
          <h3 className="text-lg md:text-xl font-serif font-bold text-charcoal-ink group-hover:text-signature-carmine transition-colors duration-200 leading-snug">
            {post.title}
          </h3>
          <p className="text-xs text-slate-gray font-serif leading-relaxed mt-3 line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between border-t border-soft-border/50 pt-4 mt-6">
          <span className="text-[10px] font-mono text-slate-gray tracking-wider">
            {post.readingTime}
          </span>
          <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-charcoal-ink group-hover:text-signature-carmine transition-colors duration-200 font-bold">
            Read Log <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/**
 * Standardized ArtistCard
 */
export interface ArtistCardProps {
  artist: Artist;
  onSelect: (id: string) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onSelect
}) => {
  return (
    <div 
      className="bg-canvas-white border border-soft-border rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300"
      id={`artist-card-${artist.id}`}
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border border-soft-border bg-[#F7F7F7] shadow-inner mb-4">
        <img 
          src={MediaService.getOptimizedUrl(artist.avatar, 'thumbnail')} 
          alt={artist.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <Badge variant={artist.role === 'Featured Artist' ? 'carmine' : 'mist'}>
        {artist.role}
      </Badge>
      <h3 className="text-base font-serif font-bold text-charcoal-ink mt-3">
        {artist.name}
      </h3>
      <p className="text-[10px] font-mono text-slate-gray tracking-wider mt-1">
        {artist.location}
      </p>
      <p className="text-xs text-slate-gray font-serif line-clamp-3 mt-3 leading-relaxed">
        {artist.bio}
      </p>
      <button
        onClick={() => onSelect(artist.id)}
        className="mt-5 text-[10px] font-mono uppercase tracking-widest text-signature-carmine font-bold hover:underline focus:outline-none cursor-pointer"
      >
        View Biography
      </button>
    </div>
  );
};

/**
 * Zen QuoteCard
 */
export const QuoteCard: React.FC<{ quote: string; author: string; role?: string }> = ({ 
  quote, 
  author, 
  role 
}) => {
  return (
    <div className="bg-studio-mist/40 border border-soft-border rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xs">
      <p className="text-lg md:text-xl font-serif italic text-charcoal-ink leading-relaxed">
        "{quote}"
      </p>
      <div className="w-8 h-[1px] bg-soft-border mx-auto my-6" />
      <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal-ink font-bold">
        {author}
      </h4>
      {role && (
        <p className="text-[9px] font-sans uppercase tracking-[0.1em] text-slate-gray mt-1 font-semibold">
          {role}
        </p>
      )}
    </div>
  );
};

/**
 * Search Bar
 */
export const SearchBar: React.FC<{ 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search the sanctuary..." }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-gray" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 bg-canvas-white border border-soft-border rounded-xl text-xs md:text-sm text-charcoal-ink placeholder:text-slate-gray/60 focus:outline-none focus:border-[#1C1C1C] transition-colors duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F0F0F0] hover:bg-[#E2E2E2] rounded-full flex items-center justify-center text-slate-gray transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

/**
 * Minimalist Filter Bar
 */
export const FilterBar: React.FC<{
  themes: string[];
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
  sortOptions: { label: string; value: string }[];
  selectedSort: string;
  onSortSelect: (sort: string) => void;
}> = ({
  themes,
  selectedTheme,
  onThemeSelect,
  sortOptions,
  selectedSort,
  onSortSelect
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-soft-border pb-6 mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-gray shrink-0" />
        <button
          onClick={() => onThemeSelect('')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md focus:outline-none whitespace-nowrap cursor-pointer ${
            selectedTheme === '' 
              ? 'bg-[#1C1C1C] text-canvas-white' 
              : 'bg-[#F9F9F9] text-slate-gray hover:bg-[#F0F0F0]'
          }`}
        >
          All Rooms
        </button>
        {themes.map(theme => (
          <button
            key={theme}
            onClick={() => onThemeSelect(theme)}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md focus:outline-none whitespace-nowrap cursor-pointer ${
              selectedTheme === theme 
                ? 'bg-[#1C1C1C] text-canvas-white' 
                : 'bg-[#F9F9F9] text-slate-gray hover:bg-[#F0F0F0]'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <span className="text-[10px] font-mono text-slate-gray uppercase">Sort:</span>
        <select
          value={selectedSort}
          onChange={(e) => onSortSelect(e.target.value)}
          className="p-2 border border-soft-border rounded-lg bg-canvas-white text-[11px] font-sans text-charcoal-ink focus:outline-none focus:border-charcoal-ink cursor-pointer"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

/**
 * Pagination component
 */
export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border border-soft-border rounded-lg text-[10px] font-mono uppercase tracking-wider disabled:opacity-40 focus:outline-none hover:bg-studio-mist/40 cursor-pointer"
      >
        Previous
      </button>
      <span className="text-[10px] font-mono text-slate-gray uppercase tracking-widest mx-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border border-soft-border rounded-lg text-[10px] font-mono uppercase tracking-wider disabled:opacity-40 focus:outline-none hover:bg-studio-mist/40 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

/**
 * Standard Dialog/Modal wrapper
 */
export const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C1C1C]/45 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-canvas-white border border-soft-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl z-10 max-h-[90vh] flex flex-col justify-between"
          >
            {title && (
              <div className="border-b border-soft-border p-5 flex items-center justify-between bg-[#FDFDFD]">
                <h3 className="text-base font-serif font-bold text-charcoal-ink">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="w-7 h-7 hover:bg-[#F0F0F0] rounded-full flex items-center justify-center text-slate-gray transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
