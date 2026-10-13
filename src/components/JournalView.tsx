/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, Calendar, Sparkles, ChevronRight, BookOpen, Tag, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const JournalView: React.FC = () => {
  const { 
    journal, 
    artworks, 
    currentRoute, 
    selectedJournalId, 
    setRoute 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [scrollProgress, setScrollProgress] = useState(0);

  const isReadingView = currentRoute === 'journal-detail' && selectedJournalId;
  const activePost = journal.find(p => p.id === selectedJournalId);

  // Track scroll progress for the reading indicator
  useEffect(() => {
    if (!isReadingView) return;
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReadingView, selectedJournalId]);

  // Filter blog posts by category
  const filteredPosts = journal.filter(post => {
    if (activeCategory === 'all') return true;
    return post.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const categories = ['all', 'Studio Diary', 'Painting Process', 'Inspiration', 'Travel', 'Collector Stories'];

  // Helper to render body content with drop-cap and dynamic pull-quotes
  const renderContent = (content: string, pullQuote?: string) => {
    const paragraphs = content.split('\n\n').map(p => p.trim()).filter(Boolean);
    let plainParagraphCount = 0;
    
    return (
      <div className="space-y-6 md:space-y-8 font-sans">
        {paragraphs.map((para, i) => {
          if (para.startsWith('###')) {
            return (
              <h3 key={i} className="text-xl md:text-2xl font-serif font-light text-charcoal-ink pt-8 pb-3 border-b border-soft-border/40 tracking-tight text-left">
                {para.replace('###', '').trim()}
              </h3>
            );
          } else if (para.startsWith('*')) {
            return (
              <ul key={i} className="list-disc pl-6 space-y-3 py-2 text-slate-gray font-light text-sm md:text-base text-left">
                {para.split('\n').map((li, liIdx) => (
                  <li key={liIdx} className="leading-relaxed">
                    {li.replace('*', '').trim()}
                  </li>
                ))}
              </ul>
            );
          } else if (para.startsWith('1.')) {
            return (
              <ol key={i} className="list-decimal pl-6 space-y-3 py-2 text-slate-gray font-light text-sm md:text-base text-left">
                {para.split('\n').map((li, liIdx) => (
                  <li key={liIdx} className="leading-relaxed">
                    {li.replace(/^\d+\.\s*/, '').trim()}
                  </li>
                ))}
              </ol>
            );
          }
          
          // Regular paragraph
          plainParagraphCount++;
          const isFirstPara = plainParagraphCount === 1;
          
          return (
            <React.Fragment key={i}>
              <p 
                className={`text-slate-gray leading-relaxed text-sm md:text-base font-light text-left ${
                  isFirstPara 
                    ? 'first-letter:text-6xl first-letter:font-serif first-letter:font-light first-letter:text-signature-carmine first-letter:float-left first-letter:mr-3.5 first-letter:leading-none first-letter:mt-1.5' 
                    : ''
                }`}
              >
                {para}
              </p>
              
              {/* Inject Pull Quote after the second plain paragraph */}
              {plainParagraphCount === 2 && pullQuote && (
                <div className="my-12 py-10 border-t border-b border-soft-border/50 text-center px-4 md:px-12">
                  <p className="font-serif italic text-lg md:text-xl text-charcoal-ink leading-relaxed max-w-2xl mx-auto">
                    "{pullQuote}"
                  </p>
                  <span className="w-12 h-[1px] bg-signature-carmine/60 block mx-auto mt-6" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // READING VIEW
  if (isReadingView && activePost) {
    const relatedArt = artworks.filter(art => 
      activePost.relatedArtworkIds?.includes(art.id)
    );
    const pullQuote = relatedArt[0]?.handwrittenNote;
    const suggestedArticles = journal.filter(p => p.id !== activePost.id).slice(0, 2);

    return (
      <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left font-sans" id="journal-reading-view">
        {/* Fixed Top Progress Indicator */}
        <div className="fixed top-0 inset-x-0 h-[3px] bg-soft-border z-50">
          <div 
            className="h-full bg-signature-carmine transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          
          {/* Elegant Back button */}
          <button
            onClick={() => setRoute('journal')}
            className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-gray hover:text-signature-carmine mb-12 transition-premium focus:outline-none cursor-pointer"
            id="journal-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Return to Chronicles</span>
          </button>

          {/* Editorial Article Meta Header */}
          <div className="space-y-6 border-b border-soft-border/60 pb-10 mb-12">
            <span className="inline-block bg-[#FAF9F5]/80 border border-soft-border/80 text-[9px] uppercase font-mono tracking-widest text-[#777777] px-3.5 py-1 rounded-xs font-bold">
              {activePost.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-charcoal-ink leading-tight tracking-tight">
              {activePost.title}
            </h1>
            <div className="flex items-center space-x-6 text-[10px] text-slate-gray/80 font-mono uppercase tracking-wider">
              <span className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-signature-carmine/70 stroke-[1.5]" />
                <span>{activePost.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-signature-carmine/70 stroke-[1.5]" />
                <span>{activePost.readingTime}</span>
              </span>
            </div>
          </div>

          {/* Large Hero Graphic Frame */}
          <div className="aspect-[16/9] rounded-xs overflow-hidden border border-soft-border/80 shadow-xs mb-14 bg-[#FAF9F5]/50 p-6">
            <img
              src={activePost.image}
              alt={activePost.title}
              className="w-full h-full object-cover rounded-xs border border-soft-border/30 shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Main Article Body with Drop Cap and Pull Quotes */}
          <div className="prose prose-slate max-w-none text-slate-gray leading-relaxed text-sm md:text-base space-y-6" id="article-prose-body">
            {renderContent(activePost.content, pullQuote)}
          </div>

          {/* Author Signature & Bio */}
          <div className="mt-16 pt-10 border-t border-soft-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-soft-border/70 flex items-center justify-center font-serif text-charcoal-ink font-light text-lg shadow-xs">
                T
              </div>
              <div className="text-left">
                <h5 className="font-serif text-sm font-medium text-charcoal-ink">Tanveen</h5>
                <p className="text-[10px] text-slate-gray font-mono uppercase tracking-widest">Lead Artist & Curator</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-gray/70 max-w-sm italic font-light font-sans text-left md:text-right leading-relaxed">
              "Her studio chronicles explore the deep interface between raw tactile minerals, sea-salt glazes, and minimalist spatial structures."
            </p>
          </div>

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-2 pt-8 mt-6">
            {activePost.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-slate-gray/80 bg-[#FAF9F5]/40 border border-soft-border/70 px-3 py-1 rounded-xs font-mono">
                <Tag className="w-3 h-3 text-signature-carmine/60" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Related Artwork Widget */}
          {relatedArt.length > 0 && (
            <div className="bg-[#FAF9F5]/70 border border-soft-border/70 rounded-xs p-6 md:p-8 mt-20 space-y-6 text-left">
              <h4 className="font-serif text-lg font-light text-charcoal-ink flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-signature-carmine stroke-[1.5]" />
                <span>Associated Curated Masterpieces</span>
              </h4>
              <p className="text-xs text-slate-gray/95 font-light leading-relaxed">
                This writing was created in companionship with the following unique canvases. Discover their spatial previews and technical dossiers:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArt.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setRoute('artwork-detail', art.id)}
                    className="flex bg-canvas-white border border-soft-border p-4 shadow-xs hover:border-[#CCCCCC] hover:shadow-sm transition-premium cursor-pointer items-center space-x-5 group rounded-xs"
                  >
                    <div className="w-20 h-20 bg-[#FAF9F5]/70 border border-soft-border/40 rounded-xs shrink-0 overflow-hidden flex items-center justify-center p-2 group-hover:scale-102 transition-transform duration-500">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="max-h-full max-w-full object-contain shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <h5 className="font-serif text-base text-charcoal-ink group-hover:text-signature-carmine transition-colors truncate">"{art.title}"</h5>
                      <p className="text-[9px] text-[#777777] font-mono uppercase tracking-widest mt-0.5">{art.medium}</p>
                      <span className="text-[10px] text-signature-carmine font-bold uppercase tracking-widest mt-2 inline-flex items-center space-x-1 group-hover:underline">
                        <span>Observe Canvas</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Reading Footer Section */}
          <div className="mt-24 pt-16 border-t border-soft-border/60">
            <div className="text-left mb-10 space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-signature-carmine font-bold">Suggested Reading</span>
              <h3 className="font-serif text-2xl font-light text-charcoal-ink tracking-tight">More from the Archives</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {suggestedArticles.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => {
                    setRoute('journal-detail', post.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-[#FAF9F5]/20 hover:bg-[#FAF9F5]/40 border border-soft-border/60 hover:border-[#CCCCCC] p-5 rounded-xs transition-premium cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-gray bg-[#FAF9F5]/80 border border-soft-border/60 px-2.5 py-0.5 rounded-xs inline-block">
                      {post.category}
                    </span>
                    <h4 className="font-serif text-lg text-charcoal-ink font-light leading-snug group-hover:text-signature-carmine transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-gray/70 font-light line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="border-t border-soft-border/40 mt-5 pt-3 flex items-center justify-between text-[10px] text-slate-gray uppercase font-bold tracking-widest font-sans">
                    <span>Read Chronicle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-signature-carmine group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    );
  }

  // STANDARD MAGAZINE ARCHIVES GRID VIEW
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left font-sans" id="journal-archives">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Elegant Editorial Header */}
        <div className="border-b border-soft-border pb-8 mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold block mb-2 font-sans">
            Studio Chronicles
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
            The Artist’s Journal
          </h2>
          <p className="text-xs md:text-sm text-slate-gray max-w-xl font-light mt-3 leading-relaxed">
            A boutique visual magazine publishing behind-the-scenes diaries, physical experiments, travel logs, and curatorial reflections on living an art-infused life.
          </p>
        </div>

        {/* Categories Chips Filters (Bespoke Minimalist Design) */}
        <div className="flex flex-wrap gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[9px] font-sans font-bold uppercase tracking-widest border transition-premium cursor-pointer focus:outline-none rounded-xs ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-charcoal-ink text-canvas-white border-charcoal-ink'
                  : 'bg-[#FAF9F5]/40 text-slate-gray border-soft-border/80 hover:border-[#CCCCCC] hover:text-charcoal-ink'
              }`}
            >
              {cat === 'all' ? 'All Publications' : cat}
            </button>
          ))}
        </div>

        {/* Featured Article Layout (Split-screen panoramic style) */}
        {featuredPost && activeCategory === 'all' && (
          <div 
            onClick={() => setRoute('journal-detail', featuredPost.id)}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-soft-border/50 pb-16 mb-16 items-center cursor-pointer text-left"
            id="journal-featured-hero"
          >
            {/* Image Frame */}
            <div className="lg:col-span-7 bg-[#FAF9F5]/70 p-6 border border-soft-border rounded-xs shadow-xs w-full">
              <div className="aspect-[16/10] overflow-hidden rounded-xs border border-soft-border/30 bg-[#FAF9F5]/30">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-[1.012] transition-transform duration-[1200ms] ease-out shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Typography Description & Metadata */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-signature-carmine font-bold block">
                  Featured Chronicle
                </span>
                <div className="flex items-center space-x-3 text-[9px] text-[#777777] font-mono uppercase tracking-widest">
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readingTime}</span>
                </div>
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl font-light text-charcoal-ink leading-tight tracking-tight group-hover:text-signature-carmine transition-premium">
                {featuredPost.title}
              </h3>
              
              <p className="text-xs md:text-sm text-slate-gray/95 font-light leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRoute('journal-detail', featuredPost.id);
                  }}
                  className="px-6 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[9px] uppercase tracking-widest font-bold rounded-xs transition-premium flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <span>Observe Chronicle</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journal Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {(activeCategory === 'all' ? remainingPosts : filteredPosts).map((post) => (
            <article
              key={post.id}
              onClick={() => setRoute('journal-detail', post.id)}
              className="group flex flex-col bg-canvas-white border border-soft-border/70 rounded-xs overflow-hidden shadow-xs hover:border-[#CCCCCC] hover:shadow-sm transition-premium cursor-pointer text-left"
              id={`journal-post-${post.id}`}
            >
              {/* Featured Cover Graphic */}
              <div className="relative aspect-[16/10] bg-[#FAF9F5]/70 p-5 overflow-hidden border-b border-soft-border/50">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-xs border border-soft-border/30 shadow-xs group-hover:scale-[1.015] transition-transform duration-[1000ms] ease-out"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-5 left-5 bg-canvas-white border border-soft-border/80 text-[8px] uppercase tracking-[0.15em] font-mono font-bold text-slate-gray px-2.5 py-1 rounded-xs shadow-xs">
                  {post.category}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[9px] text-slate-gray/70 font-mono uppercase tracking-wider">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-light text-charcoal-ink leading-snug group-hover:text-signature-carmine transition-premium">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-gray/80 line-clamp-3 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="border-t border-soft-border/40 pt-4 flex items-center justify-between text-[9px] uppercase font-bold tracking-widest font-sans">
                  <span className="text-signature-carmine flex items-center space-x-1">
                    <span>Observe Chronicle</span>
                    <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
                  </span>
                  <span className="text-slate-gray group-hover:text-signature-carmine transition-colors">
                    <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform stroke-[1.5]" />
                  </span>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
