/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingBag, Heart, Shield, Undo2, MapPin, ZoomIn, Sofa, Bed, Briefcase, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackArtworkView, trackAddToCart, trackWishlistEvent } from '../lib/analytics';

export const ArtworkDetail: React.FC = () => {
  const { 
    selectedArtworkId, 
    artworks, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setRoute, 
    placeOrder 
  } = useApp();

  const artwork = artworks.find(art => art.id === selectedArtworkId) || artworks[0];

  // Record item-level view details for GA4 & Studio intelligence on load
  React.useEffect(() => {
    if (artwork) {
      trackArtworkView(artwork);
    }
  }, [artwork?.id]);

  const [activeMediaTab, setActiveMediaTab] = useState<'painting' | 'room'>('painting');
  const [activeRoom, setActiveRoom] = useState<'living' | 'bedroom' | 'office'>('living');
  const [selectedOption, setSelectedOption] = useState<'original' | 'canvas_print' | 'fine_art_print'>('original');
  const [selectedSize, setSelectedSize] = useState<string>('Collector Size (' + artwork.size + ')');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'provenance' | 'shipping' | 'framing'>('provenance');

  // Shipping Order checkout Form state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Toggle bottom sticky bar visibility on scroll
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!artwork) return null;

  const isLiked = wishlist.includes(artwork.id);

  // Set prices dynamically depending on the selected product type
  const optionPrice = selectedOption === 'original' 
    ? artwork.price 
    : selectedOption === 'canvas_print' 
      ? (artwork.printPrice || 150) * 1.5 
      : (artwork.printPrice || 150);

  const sizesMap = {
    original: ['Collector Size (' + artwork.size + ')'],
    canvas_print: ['Medium Studio (24 × 18 inches)', 'Large Exhibition (36 × 24 inches)', 'Grand Salon (48 × 36 inches)'],
    fine_art_print: ['Classic Portfolio (16 × 12 inches)', 'Medium Gallery (24 × 18 inches)', 'Large Archive (36 × 24 inches)']
  };

  const handleOptionChange = (opt: typeof selectedOption) => {
    setSelectedOption(opt);
    setSelectedSize(sizesMap[opt][0]);
  };

  const handleAddToCart = () => {
    addToCart(artwork, selectedOption, selectedSize, optionPrice);
    trackAddToCart(artwork, selectedOption, optionPrice);
    // Route to full-page secure checkout
    setRoute('checkout');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !street || !city) return;

    const shippingInfo = {
      street,
      city,
      state,
      zipCode: zip,
      country
    };

    // Synthesize the item in cart first if the cart was empty
    addToCart(artwork, selectedOption, selectedSize, optionPrice);
    const orderResult = placeOrder(custName, custEmail, shippingInfo);
    if (orderResult) {
      setOrderCompleted(true);
    }
  };

  // Pre-configured CSS Room Mockup styles. 
  // Overlays the active painting on high-fidelity responsive CSS rooms.
  const renderRoomMockup = () => {
    const roomBackdrops = {
      living: {
        bg: 'bg-[#F2EFE9] border-[#E2DFD8]', // Scandinavian warm plaster
        accent: 'bg-[#3A3F35]', // Olive mid-century modern sofa
        furniture: 'Sofa & Floor Lamp Panel'
      },
      bedroom: {
        bg: 'bg-[#DFE3E6] border-[#CFD2D5]', // Deep cool mist wall
        accent: 'bg-[#4B3E3C]', // Soft walnut wood headboard
        furniture: 'Linen Bedsheet Panel'
      },
      office: {
        bg: 'bg-[#ECEAE4] border-[#DBD8D2]', // Contemporary executive gray plaster
        accent: 'bg-[#212529]', // Polished leather executive lounge chair
        furniture: 'Teak Sideboard Credenza'
      }
    };

    const currentRoomStyle = roomBackdrops[activeRoom];

    // Responsive scaling based on selected size
    let paintingScale = 'w-[40%] md:w-[35%]';
    if (selectedSize.includes('16 × 12') || selectedSize.includes('Classic')) {
      paintingScale = 'w-[24%] md:w-[20%]';
    } else if (selectedSize.includes('24 × 18') || selectedSize.includes('Medium')) {
      paintingScale = 'w-[32%] md:w-[28%]';
    } else if (selectedSize.includes('36 × 24') || selectedSize.includes('Large')) {
      paintingScale = 'w-[38%] md:w-[34%]';
    }

    return (
      <div className={`relative w-full aspect-16/10 rounded-xs overflow-hidden border border-soft-border/80 transition-all duration-700 ${currentRoomStyle.bg}`}>
        
        {/* Subtle grid lines matching plaster boards */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
        
        {/* Visual Wall Shadow */}
        <div className="absolute top-0 bottom-0 left-12 w-24 bg-gradient-to-r from-black/3 to-transparent" />

        {/* Dynamic Mounted Art Frame */}
        <div className="absolute inset-0 flex items-center justify-center -translate-y-12">
          <motion.div 
            layout
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`relative ${paintingScale} aspect-4/3 bg-pure-white p-2 md:p-3 rounded-sm shadow-2xl border-4 border-[#1B1B1B]`}
            style={{
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
            }}
          >
            {/* Gallery spotlight shadow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-white/30 to-transparent blur-xl pointer-events-none rounded-full" />
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Room Furniture Accents */}
        {activeRoom === 'living' && (
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-[#33382D] border-t-4 border-[#252A20] flex items-center justify-center text-canvas-white/40 font-mono text-[9px] uppercase tracking-widest">
            <span className="relative -top-2">Nordic Oak Sofa & Organic Accent Cushions</span>
          </div>
        )}
        {activeRoom === 'bedroom' && (
          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-[#544643] border-t-8 border-[#3A2F2D] flex items-center justify-center text-canvas-white/30 font-mono text-[9px] uppercase tracking-widest">
            <span className="relative">Minimalist Low-Profile Linen Platform Bed</span>
          </div>
        )}
        {activeRoom === 'office' && (
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-[#2D3135] border-t-2 border-[#1E2124] flex items-center justify-center text-canvas-white/40 font-mono text-[9px] uppercase tracking-widest">
            <span className="relative -top-2">Raw Teak Wood Credenza Panel</span>
          </div>
        )}

        {/* Room Switch Controls */}
        <div className="absolute bottom-4 left-4 z-10 flex space-x-2 bg-pure-white/90 backdrop-blur-xs p-1 rounded-full border border-soft-border shadow-md">
          <button
            onClick={() => setActiveRoom('living')}
            className={`w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center rounded-full transition-all ${
              activeRoom === 'living' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
            }`}
            title="Living Room Wall"
          >
            <Sofa className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRoom('bedroom')}
            className={`w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center rounded-full transition-all ${
              activeRoom === 'bedroom' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
            }`}
            title="Bedroom Wall"
          >
            <Bed className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRoom('office')}
            className={`w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center rounded-full transition-all ${
              activeRoom === 'office' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
            }`}
            title="Office Wall"
          >
            <Briefcase className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute top-4 right-4 bg-charcoal-ink/80 backdrop-blur-xs px-3 py-1 rounded-full border border-canvas-white/10 text-canvas-white text-[9px] uppercase tracking-widest font-sans font-semibold">
          Scale: Approximately 1:12
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-32 lg:pb-24 text-left" id="artwork-detail-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Back navigation */}
        <button
          onClick={() => setRoute('shop')}
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-gray hover:text-signature-carmine mb-10 transition-premium focus:outline-none cursor-pointer"
          id="detail-back-to-gallery"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Return to Curated Catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Dynamic Media Presentation Canvas (Zoom / Mockups) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Toggle bar between Artwork Canvas vs Room Preview */}
            <div className="flex border-b border-soft-border pb-1 gap-6">
              <button
                onClick={() => setActiveMediaTab('painting')}
                className={`pb-3 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-premium cursor-pointer focus:outline-none ${
                  activeMediaTab === 'painting' 
                    ? 'border-signature-carmine text-charcoal-ink' 
                    : 'border-transparent text-slate-gray/60 hover:text-charcoal-ink'
                }`}
                id="media-tab-painting"
              >
                1. Exhibition Dossier
              </button>
              <button
                onClick={() => setActiveMediaTab('room')}
                className={`pb-3 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-premium cursor-pointer focus:outline-none ${
                  activeMediaTab === 'room' 
                    ? 'border-signature-carmine text-charcoal-ink' 
                    : 'border-transparent text-slate-gray/60 hover:text-charcoal-ink'
                }`}
                id="media-tab-room"
              >
                2. Spatial Preview
              </button>
            </div>

            {/* Render selected display tab */}
            {activeMediaTab === 'painting' ? (
              <div 
                className="relative aspect-4/3 bg-[#FAF9F5]/80 border border-soft-border rounded-xs p-8 flex items-center justify-center overflow-hidden shadow-xs hover:border-[#CCCCCC] hover:shadow-sm transition-premium cursor-zoom-in group"
                id="details-canvas-viewer"
                onClick={() => setIsZoomed(true)}
              >
                {artwork.isSold && (
                  <div className="absolute top-6 left-6 z-20 bg-canvas-white text-[#777777] px-3.5 py-1.5 rounded-xs text-[9px] font-sans font-bold uppercase tracking-[0.15em] flex items-center space-x-1.5 shadow-xs border border-soft-border/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#999999]" />
                    <span>Private Collection</span>
                  </div>
                )}
                
                {/* Expand Zoom trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                  className="absolute bottom-6 right-6 p-2.5 bg-canvas-white/95 text-slate-gray hover:text-signature-carmine border border-soft-border rounded-xs shadow-xs z-10 hover:scale-105 transition-premium cursor-pointer focus:outline-none"
                  title="Immersive Observe View"
                >
                  <ZoomIn className="w-4 h-4 stroke-[1.5]" />
                </button>

                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  id="detail-main-img"
                />
              </div>
            ) : (
              renderRoomMockup()
            )}

            {/* Handwritten Artist Notes Section */}
            {artwork.handwrittenNote && (
              <div className="bg-gallery-blue/5 rounded-xs border border-soft-border p-6 md:p-8 text-left font-serif space-y-4 shadow-xs relative">
                <div className="absolute top-6 right-6 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-gray/60">
                  Artist Studio Diary
                </div>
                <h4 className="text-base font-light italic text-charcoal-ink">Handwritten Note by Tanveen</h4>
                <p className="text-sm md:text-base text-slate-gray/95 leading-relaxed italic">
                  "{artwork.handwrittenNote}"
                </p>
                <div className="flex items-center space-x-2 pt-2 border-t border-soft-border/50">
                  <span className="w-1.5 h-1.5 bg-signature-carmine rounded-full" />
                  <span className="text-[9px] uppercase font-sans tracking-[0.15em] text-slate-gray/80 font-bold">
                    Artveen • Studio Note #{artwork.id.slice(-3)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Acquisitions Control & Stories Panel */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-signature-carmine font-semibold font-sans">
                  Tanveen Original Artwork
                </span>
                <span className="w-6 h-[1px] bg-soft-border" />
                <span className="text-xs text-slate-gray font-mono">{artwork.year}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-charcoal-ink leading-tight">
                {artwork.title}
              </h1>
              
              <div className="flex items-center space-x-2 font-mono text-xs text-slate-gray">
                {artwork.locationInspiration && (
                  <span className="inline-flex items-center space-x-1.5 text-slate-gray font-sans bg-studio-mist px-3 py-1 rounded-xs border border-soft-border text-[10px] uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-gallery-blue" />
                    <span>Inspiration: <span className="font-semibold text-charcoal-ink">{artwork.locationInspiration}</span></span>
                  </span>
                )}
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-6 bg-pure-white border border-soft-border rounded-xs flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/80 font-mono">
                  Acquisition Value
                </p>
                <h3 className="text-3xl font-serif font-light text-charcoal-ink mt-1">
                  ${optionPrice.toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] bg-[#FAF9F5] text-slate-gray border border-soft-border px-3 py-1.5 rounded-xs uppercase tracking-widest font-semibold">
                {artwork.isSold && selectedOption === 'original' ? 'Sold Out' : 'Available for Acquisition'}
              </span>
            </div>

            {/* Acquisition Mode Selectors (Original vs Canvas Print vs Paper Print) */}
            <div className="space-y-3 text-left">
              <h4 className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/80 font-sans font-bold">
                Select Edition
              </h4>
              <div className="grid grid-cols-1 gap-3">
                
                {/* 1. One of a kind Original */}
                <button
                  onClick={() => handleOptionChange('original')}
                  className={`w-full p-4 rounded-xs text-left border flex items-center justify-between transition-all ${
                    selectedOption === 'original'
                      ? 'border-signature-carmine bg-[#FFFAFA] shadow-xs'
                      : 'border-soft-border bg-pure-white hover:border-gallery-blue'
                  }`}
                  id="opt-original"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-charcoal-ink">One-of-a-Kind Original Painting</span>
                      <span className="text-[8px] uppercase tracking-widest font-mono text-signature-carmine font-bold bg-signature-carmine/10 px-2 py-0.5 rounded-xs">Unique</span>
                    </div>
                    <p className="text-[10px] text-slate-gray leading-normal font-light">
                      Medium: {artwork.medium}. Accompanied by hand-signed physical Certificate of Authenticity.
                    </p>
                  </div>
                  <span className="font-serif font-light text-sm text-charcoal-ink">${artwork.price.toLocaleString()}</span>
                </button>

                {/* 2. Canvas Print */}
                {artwork.printsAvailable && (
                  <button
                    onClick={() => handleOptionChange('canvas_print')}
                    className={`w-full p-4 rounded-xs text-left border flex items-center justify-between transition-all ${
                      selectedOption === 'canvas_print'
                        ? 'border-signature-carmine bg-[#FFFAFA] shadow-xs'
                        : 'border-soft-border bg-pure-white hover:border-gallery-blue'
                    }`}
                    id="opt-canvas-print"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-charcoal-ink">Limited Stretched Linen Canvas Edition</span>
                      <p className="text-[10px] text-slate-gray leading-normal font-light">
                        Premium archival pigment inks, museum stretched on natural solid cedar wood backing.
                      </p>
                    </div>
                    <span className="font-serif font-light text-sm text-charcoal-ink">
                      ${((artwork.printPrice || 150) * 1.5).toLocaleString()}
                    </span>
                  </button>
                )}

                {/* 3. Fine Art Paper Print */}
                {artwork.printsAvailable && (
                  <button
                    onClick={() => handleOptionChange('fine_art_print')}
                    className={`w-full p-4 rounded-xs text-left border flex items-center justify-between transition-all ${
                      selectedOption === 'fine_art_print'
                        ? 'border-signature-carmine bg-[#FFFAFA] shadow-xs'
                        : 'border-soft-border bg-pure-white hover:border-gallery-blue'
                    }`}
                    id="opt-paper-print"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-charcoal-ink">Limited Giclée Cotton Rag Print</span>
                      <p className="text-[10px] text-slate-gray leading-normal font-light">
                        Printed on heavy 310gsm Hahnemühle Photo Rag with 1-inch white border.
                      </p>
                    </div>
                    <span className="font-serif font-light text-sm text-charcoal-ink">
                      ${(artwork.printPrice || 150).toLocaleString()}
                    </span>
                  </button>
                )}

              </div>
            </div>

            {/* Size selection Dropdown */}
            <div className="space-y-2 text-left">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/80 font-sans font-bold block">
                Choose Dimension Format
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3.5 border border-soft-border rounded-xs text-xs font-sans bg-pure-white focus:outline-none focus:border-signature-carmine transition-premium cursor-pointer"
                id="size-selector"
              >
                {sizesMap[selectedOption].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Purchase / Wishlist conversion layout */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={artwork.isSold && selectedOption === 'original'}
                className={`flex-1 py-4 text-xs font-sans font-bold uppercase tracking-widest text-canvas-white rounded-xs transition-premium cursor-pointer flex items-center justify-center space-x-2 shadow-xs focus:outline-none ${
                  artwork.isSold && selectedOption === 'original'
                    ? 'bg-slate-gray/30 text-slate-gray/70 cursor-not-allowed shadow-none'
                    : 'bg-signature-carmine hover:brightness-110'
                }`}
                id="detail-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {artwork.isSold && selectedOption === 'original' 
                    ? 'Original Acquired' 
                    : 'Initiate Acquisition'}
                </span>
              </button>

              <button
                onClick={() => {
                  trackWishlistEvent(artwork, isLiked ? 'remove' : 'add');
                  toggleWishlist(artwork.id);
                }}
                className={`p-4 rounded-xs border transition-premium cursor-pointer focus:outline-none ${
                  isLiked 
                    ? 'bg-signature-carmine/10 text-signature-carmine border-signature-carmine/20' 
                    : 'bg-pure-white text-[#777777] border-soft-border hover:border-signature-carmine hover:text-signature-carmine'
                }`}
                id="detail-wishlist-btn"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-signature-carmine' : ''}`} />
              </button>
            </div>

            {/* Editorial Information Tabs */}
            <div className="border-t border-b border-soft-border/60 py-6 my-8 space-y-4">
              <div className="flex gap-6 border-b border-soft-border/30 pb-2">
                {(['provenance', 'shipping', 'framing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailsTab(tab)}
                    className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-premium cursor-pointer focus:outline-none ${
                      activeDetailsTab === tab
                        ? 'border-signature-carmine text-charcoal-ink font-semibold'
                        : 'border-transparent text-slate-gray/60 hover:text-charcoal-ink'
                    }`}
                  >
                    {tab === 'provenance' ? 'Provenance & COA' : tab === 'shipping' ? 'Secure Transit' : 'Museum Framing'}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-gray leading-relaxed font-sans font-light min-h-[80px]">
                {activeDetailsTab === 'provenance' && (
                  <div className="space-y-2 animate-fade-in text-left">
                    <p className="font-medium text-charcoal-ink flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-signature-carmine stroke-[1.5]" />
                      <span>Certified Physical Registration</span>
                    </p>
                    <p>
                      Each unique original canvas is accompanied by a hand-signed, wax-sealed physical Certificate of Authenticity (COA) containing the exact sand coordinates from Cox’s Bazar beach delta where the natural pigments were harvested.
                    </p>
                  </div>
                )}
                {activeDetailsTab === 'shipping' && (
                  <div className="space-y-2 animate-fade-in text-left">
                    <p className="font-medium text-charcoal-ink flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-signature-carmine stroke-[1.5]" />
                      <span>Conservation Art Crate Transit</span>
                    </p>
                    <p>
                      Shipped in temperature-stabilized wooden crates lined with professional acid-free glassine wrapping. Fully insured transit with elite white-glove art couriers to guarantee pristine museum conditions.
                    </p>
                  </div>
                )}
                {activeDetailsTab === 'framing' && (
                  <div className="space-y-2 animate-fade-in text-left">
                    <p className="font-medium text-charcoal-ink flex items-center gap-2">
                      <Sofa className="w-3.5 h-3.5 text-signature-carmine stroke-[1.5]" />
                      <span>Exhibition Mounting Guidelines</span>
                    </p>
                    <p>
                      We recommend minimalist float-mounting inside a shadowbox frame of raw bleached maple or walnut, leaving a 1/2-inch border to reveal the organic deckled edges and thick crystalline sea salt sediments.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Story Section */}
            <div className="space-y-4 text-left font-sans">
              <h3 className="font-serif text-lg font-light text-charcoal-ink">Curatorial Narrative</h3>
              <p className="text-xs text-slate-gray/90 leading-relaxed font-light">
                {artwork.story}
              </p>
              
              {artwork.artistNotes && (
                <div className="bg-[#FAF9F5] p-5 rounded-xs border border-soft-border/70">
                  <h4 className="text-[9px] uppercase font-mono tracking-[0.2em] text-slate-gray/80 font-bold mb-2">
                    Collector Display Recommendation
                  </h4>
                  <p className="text-xs text-slate-gray leading-relaxed font-light italic">
                    "{artwork.artistNotes}"
                  </p>
                </div>
              )}

              {/* Studio Curation & Reproduction Standards */}
              <div className="border-t border-soft-border/60 pt-6 mt-6 space-y-4">
                <h4 className="font-serif text-base font-light text-charcoal-ink">Studio Curation & Edition Standards</h4>
                <p className="text-[11px] text-slate-gray/80 leading-relaxed font-light">
                  Tanveen's studio commits to museum-grade curation. Whether acquiring a one-of-a-kind original or a registered print edition, your piece is registered under our digital ledger.
                </p>
                
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3 bg-[#FAF9F5]/40 border border-soft-border/50 rounded-xs flex gap-3.5 items-start">
                    <div className="p-1.5 bg-[#FF0038]/5 rounded-xs shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-signature-carmine block" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-charcoal-ink uppercase tracking-wide">Original Paintings</h5>
                      <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light mt-0.5">
                        Unique masterpieces rich in natural mineral components (Inani sea-salt, tea hill soil, charcoal). Shipped in climate-sealed wood crates and accompanied by hand-signed physical Certificates of Authenticity.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5]/40 border border-soft-border/50 rounded-xs flex gap-3.5 items-start">
                    <div className="p-1.5 bg-gallery-blue/10 rounded-xs shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gallery-blue block" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-charcoal-ink uppercase tracking-wide">Limited Stretched Canvas Editions</h5>
                      <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light mt-0.5">
                        Archival pigment ink on heavyweight linen canvas, hand-stretched over sustainable solid cedar timber frames. Each canvas reproduction is limited, hand-numbered, and recorded in the collector ledger.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F5]/40 border border-soft-border/50 rounded-xs flex gap-3.5 items-start">
                    <div className="p-1.5 bg-signature-carmine/5 border border-signature-carmine/20 rounded-xs shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-signature-carmine block" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-charcoal-ink uppercase tracking-wide">Limited Giclée Cotton Rag Prints</h5>
                      <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light mt-0.5">
                        Printed on museum-grade 310gsm Hahnemühle Photo Rag cotton paper. Retains deep pigment colors with an archival lifetime exceeding 100 years. Includes a 1-inch border for mounting and numbering.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Provenance & Exhibition Series Section (Related Artworks) */}
        <div className="mt-24 pt-16 border-t border-soft-border/60">
          <div className="space-y-2 mb-10 text-left">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Series Continuation
            </span>
            <h3 className="text-3xl font-serif font-light text-charcoal-ink tracking-tight">
              Complementary Works
            </h3>
            <p className="text-xs text-slate-gray max-w-xl font-light font-sans">
              Explore companion canvases and limited edition studies created from the same coastal expedition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {artworks
              .filter(art => art.id !== artwork.id)
              .slice(0, 3)
              .map((related) => (
                <div 
                  key={related.id}
                  onClick={() => {
                    setRoute('artwork-detail', related.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-canvas-white rounded-xs border border-soft-border/70 p-4 hover:border-[#CCCCCC] hover:shadow-xs transition-premium cursor-pointer flex flex-col justify-between h-full"
                  id={`related-art-card-${related.id}`}
                >
                  <div className="aspect-4/3 bg-[#FAF9F5]/70 p-4 rounded-xs flex items-center justify-center overflow-hidden mb-4 border border-soft-border/30">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-serif text-base text-charcoal-ink group-hover:text-signature-carmine transition-colors">
                        {related.title}
                      </h4>
                      <span className="font-serif text-xs text-charcoal-ink/80 font-medium">${related.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[9px] text-[#777777] font-mono uppercase tracking-widest">{related.medium}</p>
                    <p className="text-[10px] text-slate-gray/70 font-sans mt-1">{related.size}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* Immersive Gallery Fullscreen Lightbox / Zoom View */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111]/95 backdrop-blur-md p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 text-canvas-white hover:text-signature-carmine p-2.5 bg-pure-white/10 rounded-xs border border-canvas-white/20 transition-premium cursor-pointer focus:outline-none z-10"
              title="Close Zoom"
            >
              ✕
            </button>

            {/* Lightbox Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[80vh] flex items-center justify-center pointer-events-none"
            >
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="max-h-[80vh] max-w-full object-contain shadow-2xl border border-canvas-white/10"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Immersive Metadata Footer */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-canvas-white/85 space-y-1 pointer-events-none w-full px-4">
              <h4 className="font-serif text-lg font-light">"{artwork.title}"</h4>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#999999]">
                Detail View • {artwork.medium} ({artwork.size})
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Purchase Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-0 inset-x-0 bg-pure-white/95 backdrop-blur-md border-t border-soft-border/80 px-6 py-4 flex items-center justify-between z-30 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.04)] font-sans"
          >
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-wider text-[#777777] font-mono leading-none">Acquisition Value</p>
              <p className="font-serif text-base font-semibold text-charcoal-ink mt-1">${optionPrice.toLocaleString()}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={artwork.isSold && selectedOption === 'original'}
              className={`px-5 py-2.5 text-[10px] font-sans font-bold uppercase tracking-widest text-canvas-white rounded-xs transition-premium cursor-pointer ${
                artwork.isSold && selectedOption === 'original'
                  ? 'bg-slate-gray/30 text-slate-gray/70 cursor-not-allowed'
                  : 'bg-signature-carmine hover:bg-charcoal-ink'
              }`}
            >
              {artwork.isSold && selectedOption === 'original' ? 'Sold Out' : 'Acquire'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Inline Order Checkout Modal Dialog */}
      <AnimatePresence>
        {isOrderFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderFormOpen(false)}
              className="absolute inset-0 bg-black"
              id="checkout-modal-backdrop"
            />
            {/* Form body */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-canvas-white paper-texture p-8 md:p-10 rounded-xs border border-soft-border shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left font-sans"
              id="checkout-modal"
            >
              <button
                onClick={() => setIsOrderFormOpen(false)}
                className="absolute top-6 right-6 text-slate-gray hover:text-signature-carmine p-2 transition-colors focus:outline-none"
                id="checkout-modal-close"
              >
                ✕
              </button>

              {!orderCompleted ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <div className="border-b border-soft-border/50 pb-4">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-signature-carmine font-bold">
                      Direct Secure Collector Acquisition
                    </span>
                    <h3 className="font-serif text-2xl font-light text-charcoal-ink mt-1">
                      Finalize Acquisition
                    </h3>
                  </div>

                  {/* Artwork Summary */}
                  <div className="p-4 bg-[#FAF9F5] border border-soft-border rounded-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-charcoal-ink">{artwork.title}</h4>
                      <p className="text-[10px] text-signature-carmine uppercase tracking-wider font-bold mt-1">
                        {selectedOption.replace('_', ' ')} • {selectedSize}
                      </p>
                    </div>
                    <span className="font-serif text-base font-light text-charcoal-ink">
                      ${optionPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Customer personal information */}
                  <div className="space-y-4">
                    <h4 className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/80 font-bold border-b border-soft-border/30 pb-1">
                      1. Collector Profile Information
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="sarah.jenkins@gmail.com"
                          className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-4">
                    <h4 className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/80 font-bold border-b border-soft-border/30 pb-1">
                      2. Conservation Shipping Destination
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g. 742 Evergreen Terrace"
                          className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Springfield"
                            className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="IL"
                            className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                            Postal Zip Code
                          </label>
                          <input
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="62704"
                            className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5">
                            Country
                          </label>
                          <input
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="United States"
                            className="w-full p-3 border border-soft-border rounded-xs text-base md:text-xs bg-[#FDFDFD] focus:outline-none focus:border-signature-carmine transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-gray/70 leading-relaxed italic">
                    Note: To replicate a premium gallery experience, this purchase operates inside a simulated secure sandbox checkout. You will receive an official registered tracking number and Certificate of Authenticity instantly inside your private Collector Portal order history ledger.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-4 bg-signature-carmine text-canvas-white text-xs font-bold uppercase tracking-widest rounded-xs shadow-xs hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                    id="submit-order-form-btn"
                  >
                    <span>Authorize Secure Acquisition</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xs border border-green-500/20">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-light text-charcoal-ink">Acquisition Authorized</h3>
                    <p className="text-xs text-slate-gray max-w-sm mx-auto leading-relaxed">
                      Congratulations! Your registration has been officially filed inside the Artveen historical collector ledger.
                    </p>
                  </div>
                  <div className="p-5 bg-[#FAF9F5] border border-soft-border rounded-xs text-left max-w-sm mx-auto space-y-3 font-sans text-xs">
                    <div className="flex justify-between border-b border-soft-border/50 pb-1.5 font-bold text-charcoal-ink">
                      <span>Artwork Title</span>
                      <span className="font-serif font-light">{artwork.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-soft-border/50 pb-1.5 text-slate-gray">
                      <span>Collector Profile</span>
                      <span>{custName}</span>
                    </div>
                    <div className="flex justify-between text-slate-gray">
                      <span>Delivery Destination</span>
                      <span className="truncate max-w-[200px]">{street}, {city}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOrderFormOpen(false);
                      setOrderCompleted(false);
                      setRoute('portal');
                    }}
                    className="w-full py-4 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-xs uppercase tracking-widest font-bold rounded-xs shadow-xs transition-all"
                    id="close-completed-order-btn"
                  >
                    Enter Private Collector Portal
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
