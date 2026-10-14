/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ArtveenLogo } from './ArtveenLogo';

export const Header: React.FC = () => {
  const {
    currentRoute,
    setRoute,
    cart,
    wishlist,
    currentUser,
    searchQuery,
    setSearchQuery,
    artworks,
    updateCartQuantity
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Monitor scrolling to tighten the bar and add depth once the page moves
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Gallery', route: 'shop' },
    { label: 'Collections', route: 'collections' },
    { label: 'Journal', route: 'journal' },
    { label: 'Portfolio', route: 'portfolio' },
  ];

  const handleNavClick = (route: string) => {
    setRoute(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-artveen-plum/95 backdrop-blur-md border-b border-artveen-gold/20 py-3 shadow-lg' 
            : 'bg-artveen-plum border-b border-transparent py-5'
        }`}
        id="app-header"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left focus:outline-none group cursor-pointer"
            id="nav-logo-btn"
          >
            <h1 className="sr-only">Artveen</h1>
            <ArtveenLogo
              className={`w-auto transition-all duration-300 group-hover:opacity-85 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'}`}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || 
                (link.route === 'collections' && currentRoute === 'collection-detail') ||
                (link.route === 'journal' && currentRoute === 'journal-detail') ||
                (link.route === 'shop' && currentRoute === 'artwork-detail');
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`relative font-sans text-xs uppercase tracking-[0.2em] font-bold transition-premium py-1 hover:text-artveen-gold focus:outline-none cursor-pointer ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                  id={`nav-link-${link.route}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-artveen-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utilities Panel */}
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center text-white/70 hover:text-artveen-gold transition-premium focus:outline-none cursor-pointer"
              title="Search Gallery"
              id="search-trigger-btn"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setRoute('portal')}
              className="w-11 h-11 lg:w-9 lg:h-9 hidden sm:flex items-center justify-center text-white/70 hover:text-artveen-gold transition-premium relative focus:outline-none cursor-pointer"
              title="View Wishlist"
              id="wishlist-trigger-btn"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 lg:top-0 lg:right-0 w-4 h-4 bg-artveen-red text-white text-[9px] rounded-full flex items-center justify-center font-bold font-sans animate-fade-in">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center text-white/70 hover:text-artveen-gold transition-premium relative focus:outline-none cursor-pointer"
              title="Open Shopping Cart"
              id="cart-trigger-btn"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 lg:top-0 lg:right-0 w-4 h-4 bg-artveen-gold text-artveen-plum text-[9px] rounded-full flex items-center justify-center font-bold font-sans animate-fade-in">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Collector Portal Profile Icon */}
            <button
              onClick={() => setRoute('portal')}
              className={`w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center transition-premium relative focus:outline-none cursor-pointer ${
                currentRoute === 'portal' ? 'text-artveen-gold' : 'text-white/70 hover:text-artveen-gold'
              }`}
              title="My Account / Portal"
              id="account-portal-btn"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center text-white lg:hidden hover:text-artveen-gold transition-premium focus:outline-none cursor-pointer"
              id="mobile-menu-trigger"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>

          </div>
        </div>
      </header>

      {/* Floating Active Admin HUD link */}
      {currentUser.role === 'admin' && currentRoute !== 'cms' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setRoute('cms')}
            className="flex items-center space-x-2 bg-charcoal-ink text-canvas-white px-4 py-2.5 rounded-full shadow-lg hover:bg-signature-carmine hover:scale-105 transition-all text-xs font-sans font-semibold uppercase tracking-wider"
            id="floating-cms-btn"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span>Artist Dashboard</span>
          </button>
        </div>
      )}

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal-ink/95 backdrop-blur-md z-50 flex flex-col justify-center items-center px-6"
            id="search-overlay"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-canvas-white hover:text-signature-carmine transition-colors p-3 focus:outline-none"
              id="search-close-btn"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-2xl text-center">
              <h2 className="text-2xl md:text-3xl text-canvas-white font-serif mb-6">
                Discover Art & Narratives
              </h2>
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search by painting name, medium, theme or diary posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchOpen(false);
                      setRoute('shop');
                    }
                  }}
                  className="w-full bg-transparent border-b-2 border-canvas-white/20 pb-4 text-xl md:text-2xl text-canvas-white focus:outline-none focus:border-signature-carmine transition-colors font-sans"
                  autoFocus
                  id="search-input-field"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setRoute('shop');
                  }}
                  className="absolute right-0 bottom-4 text-canvas-white hover:text-signature-carmine"
                  id="search-submit-btn"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
              <p className="text-xs text-canvas-white/50 uppercase tracking-widest font-sans">
                Press Enter to search, or try <span className="text-gallery-blue">"Ocean"</span>, <span className="text-gallery-blue">"Abstract"</span>, or <span className="text-gallery-blue">"Process"</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Shopping Cart Slider Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50"
              id="cart-backdrop"
            />
            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-canvas-white z-50 p-6 md:p-8 flex flex-col paper-texture shadow-2xl"
              id="cart-sidebar"
            >
              <div className="flex items-center justify-between border-b border-soft-border pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-charcoal-ink" />
                  <h3 className="font-serif text-lg font-bold">Your Collector Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-slate-gray hover:text-signature-carmine transition-all focus:outline-none"
                  id="cart-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 px-4">
                  <ShoppingBag className="w-12 h-12 text-gallery-blue stroke-[1] mb-2" />
                  <h4 className="font-serif text-lg font-light text-charcoal-ink">Your Collection is Empty</h4>
                  <p className="text-xs text-slate-gray/80 max-w-xs font-sans leading-relaxed">
                    Choosing fine art is an intimate journey. Browse our active sea-salt canvas exhibitions or reserved limited giclée editions to begin.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setRoute('shop');
                    }}
                    className="mt-4 text-[10px] uppercase tracking-widest font-bold px-8 py-3.5 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine hover:scale-101 transition-all rounded-xs"
                    id="cart-empty-explore-btn"
                  >
                    Explore Active Exhibitions
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex space-x-4 border-b border-soft-border/50 pb-4"
                        id={`cart-item-${item.cartItemId}`}
                      >
                        <div className="w-20 h-20 bg-[#FBFBFA] border border-soft-border rounded-xs overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 font-sans">
                          <h4 className="font-serif text-sm font-semibold text-charcoal-ink truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-signature-carmine uppercase tracking-wider font-semibold mt-0.5">
                            {item.optionType.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] text-slate-gray mt-0.5">
                            Size: {item.size}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-soft-border rounded-xs overflow-hidden bg-pure-white text-xs">
                              <button
                                onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                                className="px-2.5 py-1 hover:bg-gallery-blue/20 text-charcoal-ink font-bold transition-colors"
                                id={`cart-item-dec-${item.cartItemId}`}
                              >
                                -
                              </button>
                              <span className="px-2 font-semibold font-mono text-xs">{item.quantity}</span>
                              <button
                                onClick={() => {
                                  if (item.optionType === 'original') return; // Originals locked at max qty of 1
                                  updateCartQuantity(item.cartItemId, item.quantity + 1);
                                }}
                                className={`px-2.5 py-1 hover:bg-gallery-blue/20 text-charcoal-ink font-bold transition-colors ${
                                  item.optionType === 'original' ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                                disabled={item.optionType === 'original'}
                                id={`cart-item-inc-${item.cartItemId}`}
                              >
                                +
                              </button>
                            </div>
                            <span className="font-serif font-bold text-sm text-charcoal-ink">
                              ${(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="border-t border-soft-border pt-6 mt-6 space-y-4 font-sans">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
                      <span className="text-slate-gray">Est. Subtotal</span>
                      <span className="font-serif font-extrabold text-xl text-charcoal-ink">
                        ${cartSubtotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-gray/70 leading-relaxed font-light italic">
                      Complimentary premium global fine-art delivery, custom archival crating, and physical Certificates of Authenticity are processed on the subsequent step.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setRoute('checkout');
                      }}
                      className="w-full py-4 bg-signature-carmine text-canvas-white hover:brightness-110 transition-all text-xs uppercase tracking-widest font-bold rounded-xs flex items-center justify-center space-x-2 shadow-lg"
                      id="cart-checkout-btn"
                    >
                      <span>Initiate Secured Acquisition</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[88px] bg-artveen-plum border-b border-artveen-gold/20 z-40 p-6 flex flex-col space-y-4 lg:hidden shadow-xl font-sans"
            id="mobile-drawer"
          >
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`text-left text-sm uppercase tracking-widest font-medium py-2.5 border-b border-white/10 ${
                  currentRoute === link.route ? 'text-artveen-gold font-bold' : 'text-white/75'
                }`}
                id={`mobile-nav-${link.route}`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
