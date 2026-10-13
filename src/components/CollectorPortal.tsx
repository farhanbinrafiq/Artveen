/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  ShoppingBag, 
  Shield, 
  FileText, 
  Printer, 
  Check, 
  Star, 
  Mail, 
  MapPin, 
  User, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Address {
  id: string;
  label: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export const CollectorPortal: React.FC = () => {
  const { 
    currentUser, 
    wishlist, 
    artworks, 
    orders, 
    toggleWishlist, 
    setRoute,
    artists,
    commissions,
    submitCommissionRequest,
    submitApplication
  } = useApp();

  // Internal Tabs navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wishlist' | 'orders' | 'addresses' | 'settings' | 'commissions' | 'apply'>('dashboard');
  
  // COA modal state
  const [activeCOAOrder, setActiveCOAOrder] = useState<string | null>(null);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      label: 'Primary Residence',
      recipient: 'Sarah Jenkins',
      street: '452 Park Avenue, Penthouse B',
      city: 'New York',
      state: 'NY',
      zip: '10022',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Country Estate',
      recipient: 'Sarah Jenkins',
      street: '12 Old Lyme Road',
      city: 'Greenwich',
      state: 'CT',
      zip: '06830',
      country: 'United States',
      isDefault: false
    }
  ]);

  // Address Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrRecipient, setNewAddrRecipient] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrCountry, setNewAddrCountry] = useState('United States');

  // Profile Form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'courier'>('email');
  
  // Commission Form State
  const [commArtistId, setCommArtistId] = useState('tanveen');
  const [commDimensions, setCommDimensions] = useState('48 × 36 inches');
  const [commDescription, setCommDescription] = useState('');
  const [commBudget, setCommBudget] = useState(2500);

  // Artist Application Form State
  const [appArtistName, setAppArtistName] = useState('');
  const [appArtistEmail, setAppArtistEmail] = useState('');
  const [appPortfolioUrl, setAppPortfolioUrl] = useState('');
  const [appStatement, setAppStatement] = useState('');
  const [appMediumsInput, setAppMediumsInput] = useState('');

  // Custom Settings Toggles
  const [toggleEarlyAccess, setToggleEarlyAccess] = useState(true);
  const [togglePrintedCatalog, setTogglePrintedCatalog] = useState(false);
  const [toggleLedgerKey, setToggleLedgerKey] = useState(true);

  // Feedback Notifications
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Map wishlist IDs to actual Artwork records
  const likedArtworks = artworks.filter(art => wishlist.includes(art.id));

  // Determine which order's COA to display
  const coaOrderRecord = orders.find(o => o.id === activeCOAOrder);

  const handlePrintCertificate = () => {
    window.print();
  };

  const triggerSuccess = (message: string) => {
    setSuccessBanner(message);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrRecipient || !newAddrStreet || !newAddrCity) return;

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      recipient: newAddrRecipient,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      zip: newAddrZip,
      country: newAddrCountry,
      isDefault: savedAddresses.length === 0
    };

    setSavedAddresses(prev => [...prev, newAddress]);
    setShowAddressForm(false);
    
    // Reset Form
    setNewAddrLabel('');
    setNewAddrRecipient('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrZip('');
    setNewAddrCountry('United States');

    triggerSuccess('Delivery coordinates registered safely in your ledger.');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
    triggerSuccess('Delivery coordinates removed from registry.');
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    triggerSuccess('Default delivery coordinate updated.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess('Collector credentials and security parameters synchronized.');
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commDescription || !commDimensions || !commBudget) return;

    submitCommissionRequest({
      artistId: commArtistId,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      dimensions: commDimensions,
      description: commDescription,
      budget: Number(commBudget)
    });

    setCommDescription('');
    setCommBudget(2500);
    triggerSuccess('Commission proposal submitted successfully! The artist has been notified in their workspace.');
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appArtistName || !appArtistEmail || !appStatement) return;

    const mediums = appMediumsInput.split(',').map(m => m.trim()).filter(Boolean);

    submitApplication({
      name: appArtistName,
      email: appArtistEmail,
      portfolioUrl: appPortfolioUrl || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
      statement: appStatement,
      mediums: mediums.length ? mediums : ['Fine Art', 'Mixed Media']
    });

    setAppArtistName('');
    setAppArtistEmail('');
    setAppPortfolioUrl('');
    setAppStatement('');
    setAppMediumsInput('');
    triggerSuccess('Application dispatched securely. Studio curatorial boards review applications in 48-hour periods.');
  };

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-32 text-left font-sans" id="collector-portal-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Portal Greeting Board */}
        <div className="bg-[#FAF9F5]/70 border border-soft-border rounded-xs p-6 md:p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-left">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Collector Registry Ledger
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal-ink tracking-tight">
              Sanctuary of {currentUser.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-gray">
              <span className="flex items-center space-x-1.5 bg-[#FAF9F5] border border-soft-border/70 px-3 py-1 rounded-xs font-medium text-[10px] uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 text-signature-carmine stroke-[1.5]" />
                <span>Status: <span className="text-charcoal-ink capitalize font-bold">{currentUser.role} Member</span></span>
              </span>
              <span className="flex items-center space-x-1.5 text-[10px] font-mono tracking-wider text-slate-gray/80">
                <Mail className="w-3.5 h-3.5 text-slate-gray/40 stroke-[1.5]" />
                <span>{currentUser.email}</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setRoute('shop')}
            className="px-6 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[10px] uppercase tracking-widest font-bold rounded-xs shadow-xs transition-premium self-start md:self-auto cursor-pointer focus:outline-none"
            id="portal-explore-btn"
          >
            Observe New Canvases
          </button>
        </div>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {successBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-charcoal-ink text-canvas-white border border-canvas-white/10 rounded-xs flex items-center space-x-3 text-xs tracking-wide"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>{successBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modular Sanctuary Navigation */}
        <div className="flex border-b border-soft-border/60 overflow-x-auto scrollbar-none gap-8 pb-3 mb-12 max-w-full">
          {(['dashboard', 'wishlist', 'orders', 'addresses', 'settings', 'commissions', 'apply'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-3 border-b-2 transition-premium cursor-pointer shrink-0 focus:outline-none relative ${
                activeTab === tab
                  ? 'border-signature-carmine text-charcoal-ink'
                  : 'border-transparent text-slate-gray/50 hover:text-charcoal-ink'
              }`}
            >
              {tab === 'dashboard' && '01 / Overview'}
              {tab === 'wishlist' && `02 / Liked Canvases (${likedArtworks.length})`}
              {tab === 'orders' && `03 / Acquisition Registry (${orders.length})`}
              {tab === 'addresses' && '04 / Delivery Coordinates'}
              {tab === 'settings' && '05 / Patron Credentials'}
              {tab === 'commissions' && `06 / Custom Commissions (${commissions.filter(c => c.clientEmail === currentUser.email).length})`}
              {tab === 'apply' && '07 / Join as Artist'}
            </button>
          ))}
        </div>

        {/* CONTENT SWITCHBOARD */}
        <div className="min-h-[400px]">
          
          {/* 01 / OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Curator message */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="bg-[#FAF9F5]/70 border border-soft-border rounded-xs p-6 md:p-8 space-y-4">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#777777] font-mono block">Direct Dispatch</span>
                  <h3 className="font-serif text-2xl font-light text-charcoal-ink tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-signature-carmine stroke-[1.5]" />
                    <span>A Note from Tanveen</span>
                  </h3>
                  <p className="font-serif italic text-sm md:text-base text-slate-gray leading-relaxed font-light">
                    "My latest coastal study series has completed its sea-salt curing process inside the Dhaka studio. As a registered patron, your account holds early reserve priority. You may browse these canvases 48 hours before general publication. Thank you for continuing to sponsor independent organic art exploration."
                  </p>
                  <div className="pt-2 border-t border-soft-border/40 flex items-center justify-between text-[10px] uppercase tracking-wider font-mono">
                    <span className="text-slate-gray/70">Expedition Location: Cox’s Bazar Delta</span>
                    <span className="text-signature-carmine font-bold">Priority Reservation: Active</span>
                  </div>
                </div>

                {/* Account overview blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-canvas-white border border-soft-border/80 p-5 rounded-xs space-y-2 shadow-xs">
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-mono block">Acquisitions</span>
                    <span className="font-serif text-3xl font-light text-charcoal-ink block">{orders.length}</span>
                    <span className="text-[10px] text-slate-gray/70 block">Unique pieces certified</span>
                  </div>
                  <div className="bg-canvas-white border border-soft-border/80 p-5 rounded-xs space-y-2 shadow-xs">
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-mono block">Wishlist</span>
                    <span className="font-serif text-3xl font-light text-charcoal-ink block">{likedArtworks.length}</span>
                    <span className="text-[10px] text-slate-gray/70 block">Saved research canvases</span>
                  </div>
                  <div className="bg-canvas-white border border-soft-border/80 p-5 rounded-xs space-y-2 shadow-xs">
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-mono block">Verified Key</span>
                    <span className="font-mono text-xs font-bold text-signature-carmine block mt-1">SECURE_PATRON</span>
                    <span className="text-[10px] text-slate-gray/70 block">Ledger signature activated</span>
                  </div>
                </div>
              </div>

              {/* Private services sidebar */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div className="border border-soft-border/80 rounded-xs p-6 space-y-4 bg-[#FAF9F5]/30">
                  <h4 className="font-serif text-lg font-light text-charcoal-ink">Patron Concierge Service</h4>
                  <p className="text-xs text-slate-gray leading-relaxed font-light">
                    Your account includes private, one-on-one virtual studio tours and curatorial consultations. We can advise on spatial layout, shadowbox framing, and conservation lighting for your acquired works.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setRoute('journal')}
                      className="text-[10px] uppercase tracking-widest font-bold text-signature-carmine hover:underline flex items-center space-x-1"
                    >
                      <span>Read Studio Journals</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="border border-soft-border/60 rounded-xs p-5 bg-canvas-white space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <Shield className="w-4 h-4 text-signature-carmine stroke-[1.5]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-ink">Archival Quality Promise</span>
                  </div>
                  <p className="text-[11px] text-slate-gray/80 leading-relaxed font-light">
                    Every canvas represents raw, untreated beach pigments suspended in heavy-bodied polymer resins. We seal each frame to prevent salt calcification under dry atmospheres.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 02 / SAVED PIECES WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="text-left">
              {likedArtworks.length === 0 ? (
                <div className="py-20 bg-[#FAF9F5]/40 border border-soft-border rounded-xs text-center p-8 space-y-5 max-w-2xl mx-auto">
                  <Heart className="w-12 h-12 text-[#CCCCCC] stroke-[1.2] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-light text-charcoal-ink">No saved artwork yet.</h4>
                    <p className="text-xs text-slate-gray/70 max-w-sm mx-auto leading-relaxed">
                      Start exploring and build your personal collection.
                    </p>
                  </div>
                  <button
                    onClick={() => setRoute('shop')}
                    className="px-6 py-2.5 bg-charcoal-ink hover:bg-signature-carmine text-canvas-white text-[10px] uppercase tracking-widest font-bold rounded-xs transition-premium cursor-pointer"
                  >
                    Explore Curated Gallery
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {likedArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="group bg-canvas-white border border-soft-border rounded-xs overflow-hidden shadow-xs hover:border-[#CCCCCC] transition-premium flex flex-col justify-between"
                      id={`wishlist-art-card-${art.id}`}
                    >
                      <div className="relative aspect-4/3 bg-[#FAF9F5]/70 p-6 flex items-center justify-center border-b border-soft-border/40">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="max-h-full max-w-full object-contain shadow-xs group-hover:scale-[1.012] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => toggleWishlist(art.id)}
                          className="absolute top-4 right-4 p-2 bg-canvas-white/95 text-slate-gray/60 hover:text-signature-carmine border border-soft-border/70 rounded-xs transition-premium cursor-pointer shadow-xs focus:outline-none"
                          title="Remove canvas from bookmarks"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-5 space-y-4 text-left">
                        <div className="space-y-1">
                          <h4 
                            onClick={() => setRoute('artwork-detail', art.id)}
                            className="font-serif text-lg font-light text-charcoal-ink hover:text-signature-carmine transition-colors cursor-pointer"
                          >
                            {art.title}
                          </h4>
                          <p className="text-[9px] text-[#777777] font-mono uppercase tracking-widest">{art.medium}</p>
                          <p className="text-[11px] text-slate-gray/70 mt-1">{art.size}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-soft-border/40 pt-3 text-xs">
                          <span className="font-serif font-medium text-charcoal-ink text-sm">${art.price.toLocaleString()}</span>
                          <button
                            onClick={() => setRoute('artwork-detail', art.id)}
                            className="text-[10px] uppercase font-bold text-signature-carmine tracking-widest hover:underline flex items-center"
                          >
                            <span>Observe Specimen →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 03 / ACQUISITION REGISTRY ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="text-left space-y-10">
              {orders.length === 0 ? (
                <div className="py-20 bg-[#FAF9F5]/40 border border-soft-border rounded-xs text-center p-8 space-y-4 max-w-2xl mx-auto flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 text-[#CCCCCC] stroke-[1.2]" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-light text-charcoal-ink">Your collector journey is just beginning.</h4>
                    <p className="text-xs text-slate-gray/70 max-w-sm mx-auto leading-relaxed">
                      Explore our latest artwork.
                    </p>
                  </div>
                  <button
                    onClick={() => setRoute('shop')}
                    className="px-6 py-2.5 bg-charcoal-ink hover:bg-signature-carmine text-canvas-white text-[10px] uppercase tracking-widest font-bold rounded-xs transition-premium cursor-pointer mt-2"
                  >
                    Explore Curated Gallery
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {orders.map((order) => {
                    const orderDateStr = order.date || (order as any).orderDate || 'In Progress';
                    const totalVal = order.total || (order as any).totalPrice || 0;
                    return (
                      <div
                        key={order.id}
                        className="bg-[#FAF9F5]/45 border border-soft-border p-6 rounded-xs shadow-xs text-left space-y-5"
                        id={`order-record-${order.id}`}
                      >
                        <div className="flex justify-between items-start border-b border-soft-border/50 pb-3">
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-wider text-slate-gray bg-[#FAF9F5] border border-soft-border/60 px-2.5 py-0.5 rounded-xs font-mono inline-block">
                              Registry ID #{order.id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-[10px] text-slate-gray/70 block mt-1 font-mono uppercase tracking-wider">{orderDateStr}</p>
                          </div>
                          <span className="bg-canvas-white text-slate-gray border border-soft-border/80 px-2.5 py-1 rounded-xs text-[9px] font-mono uppercase tracking-wider">
                            Status: {order.status}
                          </span>
                        </div>

                        {/* Order Art Items */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.cartItemId || item.id} className="flex justify-between text-xs items-center gap-4">
                              <div className="min-w-0">
                                <span className="font-serif text-base text-charcoal-ink">"{item.title}"</span>
                                <p className="text-[9px] text-signature-carmine uppercase tracking-wider font-bold mt-0.5">
                                  {item.optionType.replace(/_/g, ' ')} • {item.size}
                                </p>
                              </div>
                              <span className="font-serif text-sm text-charcoal-ink shrink-0 font-medium">
                                ${item.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Coordinate in order */}
                        <div className="bg-[#FAF9F5] p-3 border border-soft-border/70 rounded-xs text-[11px] text-slate-gray space-y-1">
                          <div className="flex items-center space-x-1.5 text-[9px] text-[#777777] uppercase tracking-wider font-mono">
                            <MapPin className="w-3 h-3 text-signature-carmine/60" />
                            <span>Delivery Destination</span>
                          </div>
                          <p className="font-sans font-light">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                          </p>
                        </div>

                        <div className="border-t border-soft-border/50 pt-4 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-gray/80 text-[10px] uppercase font-mono tracking-wider">Total Certified: </span>
                            <span className="font-serif text-base text-charcoal-ink font-semibold ml-1">
                              ${totalVal.toLocaleString()}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => setActiveCOAOrder(order.id)}
                            className="px-4 py-2 bg-signature-carmine/10 text-signature-carmine border border-signature-carmine/20 rounded-xs hover:bg-signature-carmine hover:text-canvas-white transition-premium text-[10px] font-sans font-bold uppercase tracking-widest flex items-center space-x-1.5 cursor-pointer focus:outline-none"
                            id={`coa-btn-${order.id}`}
                          >
                            <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
                            <span>COA Document</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 04 / DELIVERY COORDINATES TAB */}
          {activeTab === 'addresses' && (
            <div className="text-left space-y-10">
              <div className="flex justify-between items-center border-b border-soft-border/50 pb-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-light text-charcoal-ink tracking-tight">Saved Delivery Coordinates</h3>
                  <p className="text-xs text-slate-gray/70">Manage locations for fragile, temperature-controlled white-glove shipping.</p>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-4 py-2 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[9px] uppercase tracking-widest font-bold rounded-xs transition-premium flex items-center space-x-1.5 cursor-pointer focus:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Add Coordinate</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleAddAddress} className="bg-[#FAF9F5]/70 border border-soft-border p-6 rounded-xs space-y-5 max-w-xl">
                      <h4 className="font-serif text-lg font-light text-charcoal-ink">New Coordinate Registration</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Location Identifier (e.g. Townhouse)</label>
                          <input
                            type="text"
                            required
                            placeholder="Home, Gallery office, Chalet"
                            value={newAddrLabel}
                            onChange={(e) => setNewAddrLabel(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Recipient Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Sarah Jenkins"
                            value={newAddrRecipient}
                            onChange={(e) => setNewAddrRecipient(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Street Address & Suite</label>
                        <input
                          type="text"
                          required
                          placeholder="Street Address, Apt, Floor"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">City</label>
                          <input
                            type="text"
                            required
                            placeholder="New York"
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">State / Region</label>
                          <input
                            type="text"
                            placeholder="NY"
                            value={newAddrState}
                            onChange={(e) => setNewAddrState(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Zip Code</label>
                          <input
                            type="text"
                            required
                            placeholder="10022"
                            value={newAddrZip}
                            onChange={(e) => setNewAddrZip(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Country</label>
                          <input
                            type="text"
                            required
                            placeholder="United States"
                            value={newAddrCountry}
                            onChange={(e) => setNewAddrCountry(e.target.value)}
                            className="w-full bg-canvas-white border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[9px] uppercase tracking-widest font-bold rounded-xs transition-premium cursor-pointer"
                        >
                          Register Coordinates
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-5 py-2.5 border border-soft-border/80 text-slate-gray hover:text-charcoal-ink text-[9px] uppercase tracking-widest font-bold rounded-xs transition-premium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Coordinates List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border p-6 rounded-xs relative flex flex-col justify-between space-y-4 shadow-xs ${
                      addr.isDefault 
                        ? 'border-signature-carmine bg-[#FAF9F5]/40' 
                        : 'border-soft-border bg-canvas-white hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif text-lg text-charcoal-ink flex items-center space-x-2">
                          <span>{addr.label}</span>
                          {addr.isDefault && (
                            <span className="bg-signature-carmine/10 text-signature-carmine text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-xs font-sans">
                              Default Primary
                            </span>
                          )}
                        </h4>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-slate-gray/40 hover:text-signature-carmine transition-colors p-1"
                            title="Remove coordinates"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-slate-gray space-y-1 font-sans font-light">
                        <p className="font-semibold text-charcoal-ink">{addr.recipient}</p>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zip}</p>
                        <p className="text-[10px] text-[#777777] font-mono tracking-wider uppercase">{addr.country}</p>
                      </div>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[9px] uppercase font-bold tracking-widest text-[#777777] hover:text-signature-carmine self-start focus:outline-none"
                      >
                        Set as Primary Address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 05 / PATRON SETTINGS & PROFILE TAB */}
          {activeTab === 'settings' && (
            <div className="text-left max-w-4xl">
              <form onSubmit={handleSaveProfile} className="space-y-10">
                
                {/* Credentials Section */}
                <div className="space-y-6">
                  <div className="border-b border-soft-border/50 pb-2">
                    <h3 className="font-serif text-xl font-light text-charcoal-ink tracking-tight">Collector Credentials</h3>
                    <p className="text-xs text-slate-gray/70">Configure your identification values inside the studio records.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Full Collector Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#FAF9F5]/40 border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono">Authenticated Email</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-[#FAF9F5]/40 border border-soft-border/80 rounded-xs p-2.5 text-base md:text-xs text-charcoal-ink focus:border-[#CCCCCC] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-slate-gray font-mono block">Preferred Curatorial Contact Route</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(['email', 'phone', 'courier'] as const).map((method) => (
                        <div
                          key={method}
                          onClick={() => setPreferredContact(method)}
                          className={`border p-4 rounded-xs cursor-pointer transition-premium flex items-center space-x-3 shadow-xs ${
                            preferredContact === method
                              ? 'border-signature-carmine bg-[#FAF9F5]/50'
                              : 'border-soft-border bg-canvas-white hover:border-[#CCCCCC]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="contact_method"
                            checked={preferredContact === method}
                            onChange={() => {}} // handled by div click
                            className="accent-signature-carmine"
                          />
                          <div className="text-left">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-ink block capitalize">{method} Advisory</span>
                            <span className="text-[9px] text-slate-gray/75 font-sans leading-none">
                              {method === 'email' && 'Direct digital dispatch'}
                              {method === 'phone' && 'Private voice invitation'}
                              {method === 'courier' && 'Hand-written postal invitations'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications & Advanced Security */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-soft-border/50 pb-2">
                    <h3 className="font-serif text-xl font-light text-charcoal-ink tracking-tight">Preferences & Security Keys</h3>
                    <p className="text-xs text-slate-gray/70">Tune early reserve filters and public security ledger parameters.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between border border-soft-border/70 p-4 rounded-xs bg-canvas-white hover:border-[#CCCCCC] transition-premium">
                      <div className="space-y-1 pr-6 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-ink block">48-Hour Priority Early Access Previews</span>
                        <p className="text-[11px] text-slate-gray/70 leading-relaxed font-light">
                          Get immediate digital invites and private catalog lists 2 full days before new thematic expeditions launch to the public. Highly recommended to retain priority slots.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={toggleEarlyAccess}
                        onChange={(e) => setToggleEarlyAccess(e.target.checked)}
                        className="w-4 h-4 accent-signature-carmine mt-1 shrink-0"
                      />
                    </div>

                    <div className="flex items-start justify-between border border-soft-border/70 p-4 rounded-xs bg-canvas-white hover:border-[#CCCCCC] transition-premium">
                      <div className="space-y-1 pr-6 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-ink block">Hand-bound Annual Catalog Dispatch</span>
                        <p className="text-[11px] text-slate-gray/70 leading-relaxed font-light">
                          Receive our physical, custom hand-pressed studio ledger containing printed high-contrast catalog previews, travel notes, and sediment research diaries. Shipped flat in a heavy card carton.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={togglePrintedCatalog}
                        onChange={(e) => setTogglePrintedCatalog(e.target.checked)}
                        className="w-4 h-4 accent-signature-carmine mt-1 shrink-0"
                      />
                    </div>

                    <div className="flex items-start justify-between border border-soft-border/70 p-4 rounded-xs bg-canvas-white hover:border-[#CCCCCC] transition-premium">
                      <div className="space-y-1 pr-6 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-ink block">Cryptographic Ledger Keys Integration</span>
                        <p className="text-[11px] text-slate-gray/70 leading-relaxed font-light">
                          Verify ownership records on our private digital registration blockchain. Adds a second layer of public verification metadata to physical wax COA documents.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={toggleLedgerKey}
                        onChange={(e) => setToggleLedgerKey(e.target.checked)}
                        className="w-4 h-4 accent-signature-carmine mt-1 shrink-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-6 border-t border-soft-border/60">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[10px] uppercase tracking-widest font-bold rounded-xs shadow-xs transition-premium cursor-pointer focus:outline-none"
                  >
                    Save Patron Preferences
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Tab 6: Custom Commissions Form & Solicitations */}
          {activeTab === 'commissions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 bg-[#FCFBF7] border border-soft-border p-6 md:p-8 rounded-xs space-y-6">
                <div className="border-b border-soft-border/50 pb-4">
                  <h3 className="font-serif text-xl font-bold text-charcoal-ink">Commission a Masterpiece</h3>
                  <p className="text-xs text-slate-gray font-light mt-1">
                    Collaborate directly with any of our verified artists to design a custom bespoke canvas tailored for your residence, boardroom, or luxury space.
                  </p>
                </div>

                <form onSubmit={handleCommissionSubmit} className="space-y-5 text-left font-sans text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Target Artist</label>
                      <select
                        value={commArtistId}
                        onChange={(e) => setCommArtistId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none"
                      >
                        {artists.map(art => (
                          <option key={art.id} value={art.id}>{art.name} ({art.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Preferred Dimensions</label>
                      <select
                        value={commDimensions}
                        onChange={(e) => setCommDimensions(e.target.value)}
                        className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none"
                      >
                        <option value="24 × 24 inches">24 × 24 inches (Square Study)</option>
                        <option value="36 × 36 inches">36 × 36 inches (Medium Square)</option>
                        <option value="48 × 36 inches">48 × 36 inches (Standard Landscape/Portrait)</option>
                        <option value="60 × 40 inches">60 × 40 inches (Large Impact Statement)</option>
                        <option value="72 × 48 inches">72 × 48 inches (Bespoke Corporate Wall)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Project Budget ($ USD)</label>
                    <input
                      type="number"
                      value={commBudget}
                      onChange={(e) => setCommBudget(Number(e.target.value))}
                      min="1000"
                      step="100"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none font-mono"
                    />
                    <p className="text-[9px] text-slate-gray">Note: Original hand-crafted commissions start at a standard $1,000 USD floor.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Vision, Color Tone & Intended Wall Setting</label>
                    <textarea
                      value={commDescription}
                      onChange={(e) => setCommDescription(e.target.value)}
                      rows={5}
                      required
                      placeholder="Describe your vision (e.g., 'An expansive seascape utilizing thick modeling paste, heavy sea-salt textures, and deep Columbia Blue. Intended for a high-light residential entryway...')"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[10px] uppercase tracking-widest font-bold rounded-xs shadow-xs transition-premium cursor-pointer"
                  >
                    Submit Commission Proposal
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Solicitations log */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAF9F5]/80 border border-soft-border p-6 rounded-xs">
                  <h4 className="font-serif font-bold text-sm text-charcoal-ink border-b border-soft-border pb-2 mb-4 flex items-center justify-between">
                    <span>Your Proposal History</span>
                    <Clock className="w-4 h-4 text-slate-gray" />
                  </h4>

                  {commissions.filter(c => c.clientEmail === currentUser.email).length === 0 ? (
                    <p className="text-xs text-slate-gray/70 leading-relaxed font-light py-4 text-center">
                      No active commission requests logged in your registry.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {commissions.filter(c => c.clientEmail === currentUser.email).map((comm) => (
                        <div key={comm.id} className="p-4 bg-pure-white border border-soft-border rounded-xs space-y-2 text-xs">
                          <div className="flex items-center justify-between font-serif">
                            <span className="font-bold text-charcoal-ink">
                              {artists.find(a => a.id === comm.artistId)?.name || 'Ecosystem Artist'}
                            </span>
                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                              comm.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              comm.status === 'In_Progress' ? 'bg-blue-100 text-blue-800' :
                              comm.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {comm.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-gray text-[11px] leading-relaxed italic">"{comm.description}"</p>
                          <div className="pt-2 border-t border-soft-border/30 flex justify-between text-[10px] text-slate-gray font-mono">
                            <span>{comm.dimensions}</span>
                            <span className="font-bold text-charcoal-ink">${comm.budget?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#FCFBF7] border border-soft-border p-6 rounded-xs space-y-3">
                  <h5 className="font-serif font-bold text-xs text-charcoal-ink flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                    <span>The Archival Guarantee</span>
                  </h5>
                  <p className="text-[11px] text-slate-gray leading-relaxed font-light">
                    Every custom commission comes complete with a fully registered physical Certificate of Authenticity signed by the artist, accompanied by high-end studio-made floating raw wood frames.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Independent Artist Exhibiting Application */}
          {activeTab === 'apply' && (
            <div className="max-w-2xl mx-auto bg-[#FCFBF7] border border-soft-border p-6 md:p-10 rounded-xs space-y-6">
              <div className="border-b border-soft-border/50 pb-4 text-center">
                <span className="text-[9px] uppercase tracking-[0.4em] text-signature-carmine font-bold">Exhibitor Alliance</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal-ink mt-1">Apply to Exhibit at Art Escape</h3>
                <p className="text-xs text-slate-gray font-light mt-1 max-w-md mx-auto leading-relaxed">
                  Are you an independent fine artist working with high material tactility? We invite guest artists and partners to exhibit alongside Tanveen in our digital sanctuary.
                </p>
              </div>

              <form onSubmit={handleApplicationSubmit} className="space-y-5 text-left font-sans text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={appArtistName}
                      onChange={(e) => setAppArtistName(e.target.value)}
                      placeholder="e.g. Sajid Mahmud"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Professional Email Address</label>
                    <input
                      type="email"
                      required
                      value={appArtistEmail}
                      onChange={(e) => setAppArtistEmail(e.target.value)}
                      placeholder="e.g. sajid@mahmudart.com"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Portfolio or Website URL</label>
                    <input
                      type="url"
                      value={appPortfolioUrl}
                      onChange={(e) => setAppPortfolioUrl(e.target.value)}
                      placeholder="e.g. https://sajidmahmud.art"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Exhibited Mediums (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={appMediumsInput}
                      onChange={(e) => setAppMediumsInput(e.target.value)}
                      placeholder="e.g. Woodblock Prints, Linen Ink, Tempera"
                      className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-charcoal-ink">Artist Statement & Tactility Vision</label>
                  <textarea
                    required
                    value={appStatement}
                    onChange={(e) => setAppStatement(e.target.value)}
                    rows={5}
                    placeholder="Describe your practice, and how your canvas experiments capture natural substances (sea salts, forest muds, specialized minerals, tea soils)..."
                    className="w-full px-3 py-2.5 bg-canvas-white border border-soft-border text-charcoal-ink rounded-xs focus:ring-1 focus:ring-signature-carmine focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-[10px] uppercase tracking-widest font-bold rounded-xs shadow-xs transition-premium cursor-pointer"
                >
                  Submit Application Registry
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Museum-Grade Certificate of Authenticity Modal Backdrop */}
      <AnimatePresence>
        {activeCOAOrder && coaOrderRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCOAOrder(null)}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md"
              id="coa-modal-backdrop"
            />
            
            {/* Certificate Template Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#FCFBF7] text-[#1D1B18] p-8 md:p-14 rounded-xs border-8 border-double border-[#C5A880] shadow-2xl z-10 text-center select-none"
              style={{
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5), inset 0 0 50px rgba(197,168,128,0.1)'
              }}
              id="coa-certificate-panel"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCOAOrder(null)}
                className="absolute top-4 right-4 text-slate-gray/50 hover:text-signature-carmine p-2.5 text-sm font-bold print:hidden cursor-pointer focus:outline-none"
                id="coa-close-btn"
                title="Close sheet"
              >
                ✕
              </button>

              {/* Decorative classical vector corners */}
              <div className="absolute top-4 left-4 border-t-2 border-l-2 border-[#C5A880] w-6 h-6" />
              <div className="absolute top-4 right-4 border-t-2 border-r-2 border-[#C5A880] w-6 h-6" />
              <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-[#C5A880] w-6 h-6" />
              <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-[#C5A880] w-6 h-6" />

              {/* Certificate content layout */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="font-serif text-[10px] uppercase tracking-[0.45em] text-[#C5A880] font-bold">
                    Tanveen’s Art Escape
                  </h3>
                  <h1 className="font-serif text-3xl md:text-4xl italic text-[#1D1B18] font-light">
                    Certificate of Authenticity
                  </h1>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-gray/70 font-mono">
                    Official Curatorial Registry Document
                  </p>
                </div>

                <div className="w-16 h-[1px] bg-[#C5A880]/60 mx-auto" />

                <div className="space-y-4 max-w-md mx-auto text-xs md:text-sm leading-relaxed font-serif text-[#1D1B18]/95">
                  <p className="italic">
                    This document serves as physical certification that the original artwork or certified limited edition print detailed herein represents an authentic creation designed, registered, and authorized by the artist <strong>Tanveen</strong>.
                  </p>
                </div>

                {/* Metadata block */}
                <div className="bg-[#FAF9F5] border border-[#E9E4DB] rounded-xs p-5 text-left max-w-lg mx-auto grid grid-cols-2 gap-6 font-sans text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Artwork Title</span>
                    <span className="font-serif font-bold text-sm text-[#1D1B18]">"{coaOrderRecord.items[0]?.title}"</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Acquisition Date</span>
                    <span className="font-bold text-[#1D1B18]">{coaOrderRecord.date || (coaOrderRecord as any).orderDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Registry ID</span>
                    <span className="font-mono font-bold text-signature-carmine">
                      {coaOrderRecord.certificateCode || `COA-REG-${coaOrderRecord.id.slice(-8).toUpperCase()}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Material & Format</span>
                    <span className="font-bold text-[#1D1B18] capitalize">
                      {coaOrderRecord.items[0]?.optionType.replace(/_/g, ' ')} ({coaOrderRecord.items[0]?.size})
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-gray/70 max-w-md mx-auto font-sans leading-relaxed">
                  Stretched on organic cedar wood backing using Hahnemühle cotton substrate, sealed under lightfast archival UV glazes with physical micro-grain charcoal textures.
                </p>

                {/* Classical signature block */}
                <div className="flex justify-between items-end max-w-lg mx-auto pt-6 border-t border-[#E9E4DB]/60 font-sans">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Authorized By</span>
                    <span className="font-serif font-bold text-xs text-[#1D1B18]">Tanveen Fine Art Gallery</span>
                    <span className="text-[9px] text-slate-gray/70 block">Dhaka, Bangladesh</span>
                  </div>
                  
                  {/* Digital Signature Seal Mock */}
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C5A880]/50 flex items-center justify-center font-serif text-[10px] italic text-[#C5A880] relative">
                    <span className="absolute -rotate-12">Wax Seal</span>
                  </div>

                  <div className="text-right">
                    <div className="w-32 h-[1px] bg-[#C5A880] mb-2" />
                    <span className="font-serif italic text-lg block font-bold text-signature-carmine pr-2">Tanveen</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-gray/80 font-semibold block">Artist Sign-off Signature</span>
                  </div>
                </div>

                {/* Print button controls */}
                <div className="pt-8 border-t border-[#E9E4DB] flex justify-center space-x-4 print:hidden">
                  <button
                    onClick={handlePrintCertificate}
                    className="px-6 py-3 bg-charcoal-ink text-canvas-white hover:bg-[#C5A880] hover:text-charcoal-ink text-[10px] uppercase tracking-widest font-bold rounded-xs shadow-xs transition-premium flex items-center space-x-2 cursor-pointer focus:outline-none"
                  >
                    <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Print COA Certificate</span>
                  </button>
                  <button
                    onClick={() => setActiveCOAOrder(null)}
                    className="px-6 py-3 border border-soft-border text-slate-gray hover:text-charcoal-ink text-[10px] uppercase tracking-widest font-bold rounded-xs transition-premium cursor-pointer focus:outline-none"
                  >
                    Close Ledger Sheet
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
