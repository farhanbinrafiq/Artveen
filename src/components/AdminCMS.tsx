/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Artwork } from '../types';
import { 
  SlidersHorizontal, Plus, Trash2, Edit2, Check, TrendingUp, 
  DollarSign, Archive, FileText, CheckCircle, Award, Search, 
  Eye, Settings, LineChart, Percent, Activity, MousePointer, 
  UserCheck, AlertTriangle, Link2, Download, RefreshCw, BarChart2
} from 'lucide-react';
import { motion } from 'motion/react';
import { getStoredMetrics } from '../lib/analytics';

export const AdminCMS: React.FC = () => {
  const { 
    artworks, 
    collections, 
    journal, 
    orders, 
    addArtwork, 
    deleteArtwork, 
    updateOrderStatus,
    artists,
    applications,
    commissions,
    updateApplicationStatus,
    updateCommissionStatus,
    activeDataSource,
    changeDataSource,
    featureFlags,
    toggleFeatureFlag,
    siteSettings,
    updateSiteSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'artworks' | 'orders' | 'analytics' | 'artists' | 'settings'>('artworks');
  const [metrics, setMetrics] = useState(() => getStoredMetrics());

  useEffect(() => {
    if (activeTab === 'analytics') {
      setMetrics(getStoredMetrics());
    }
  }, [activeTab, orders.length]);

  // New Artwork Form State
  const [artTitle, setArtTitle] = useState('');
  const [artArtistId, setArtArtistId] = useState('tanveen');
  const [artCollection, setArtCollection] = useState(collections[0]?.id || '');
  const [artTheme, setArtTheme] = useState('Ocean');
  const [artMedium, setArtMedium] = useState('Heavy Acrylic & Sea Salt on Canvas');
  const [artSize, setArtSize] = useState('36 × 24 inches');
  const [artPrice, setArtPrice] = useState(1200);
  const [artPrintsAvailable, setArtPrintsAvailable] = useState(true);
  const [artPrintPrice, setArtPrintPrice] = useState(150);
  const [artOrientation, setArtOrientation] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const [artDesc, setArtDesc] = useState('');
  const [artStory, setArtStory] = useState('');
  const [artHandwrittenNote, setArtHandwrittenNote] = useState('');
  const [artLocationInspiration, setArtLocationInspiration] = useState('');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800');

  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const handleCreateArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artDesc || !artStory) return;

    const newArt: Omit<Artwork, 'id'> = {
      artistId: artArtistId,
      title: artTitle,
      collectionId: artCollection,
      theme: artTheme,
      medium: artMedium,
      size: artSize,
      price: Number(artPrice),
      printsAvailable: artPrintsAvailable,
      printPrice: Number(artPrintPrice),
      isOriginal: true,
      isSold: false,
      orientation: artOrientation,
      description: artDesc,
      story: artStory,
      handwrittenNote: artHandwrittenNote,
      artistNotes: "This canvas is heavy-textured and will expand beautifully under low-glare warm spot lights.",
      locationInspiration: artLocationInspiration,
      image: artImage,
      featured: true,
      year: '2026'
    };

    addArtwork(newArt);
    setIsSuccessMessage(true);

    // Reset Form
    setArtTitle('');
    setArtDesc('');
    setArtStory('');
    setArtHandwrittenNote('');
    setArtLocationInspiration('');

    setTimeout(() => setIsSuccessMessage(false), 3000);
  };

  // Compile Analytics
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalArtworksListed = artworks.length;
  const originalArtworksSold = artworks.filter(art => art.isSold).length;

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left font-sans" id="admin-cms-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="border-b border-soft-border pb-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold">
              Artist Studio Core
            </span>
            <h2 className="text-3xl font-serif font-bold text-charcoal-ink mt-1">
              Admin CMS Control Panel
            </h2>
            <p className="text-xs text-slate-gray font-sans font-light mt-1">
              Authorized interface for updating artworks, managing order crating streams, and monitoring collector analytics.
            </p>
          </div>

          {/* Tab selectors */}
          <div className="flex border border-soft-border rounded-full p-1 bg-pure-white shadow-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'artworks' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
              }`}
            >
              Artworks Catalog
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
              }`}
            >
              Studio Analytics
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'artists' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
              }`}
            >
              Ecosystem & Artists ({applications.filter(a => a.status === 'Pending').length + commissions.filter(c => c.status === 'Requested').length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-charcoal-ink text-canvas-white' : 'text-slate-gray hover:text-charcoal-ink'
              }`}
            >
              Ecosystem Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Artworks catalog and Creator form */}
        {activeTab === 'artworks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side: Add New Artwork Form */}
            <form onSubmit={handleCreateArtwork} className="lg:col-span-5 bg-pure-white border border-soft-border p-6 rounded-3xl space-y-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-charcoal-ink border-b border-soft-border/50 pb-2">
                Release New Artwork
              </h3>

              {isSuccessMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Artwork released into database successfully!</span>
                </div>
              )}

              <div className="space-y-3 text-xs text-slate-gray">
                <div>
                  <label className="font-semibold block mb-1">Artwork Title *</label>
                  <input
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="e.g. Cerulean Surge"
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Artist Creator</label>
                  <select
                    value={artArtistId}
                    onChange={(e) => setArtArtistId(e.target.value)}
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                  >
                    {artists.map(art => (
                      <option key={art.id} value={art.id}>{art.name} ({art.role})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Theme Category</label>
                    <input
                      type="text"
                      required
                      value={artTheme}
                      onChange={(e) => setArtTheme(e.target.value)}
                      placeholder="e.g. Ocean"
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Curated Exhibition Series</label>
                    <select
                      value={artCollection}
                      onChange={(e) => setArtCollection(e.target.value)}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    >
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Physical Size *</label>
                    <input
                      type="text"
                      required
                      value={artSize}
                      onChange={(e) => setArtSize(e.target.value)}
                      placeholder="e.g. 36 × 24 inches"
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Orientation Format</label>
                    <select
                      value={artOrientation}
                      onChange={(e) => setArtOrientation(e.target.value as any)}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    >
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Paint Medium Materials</label>
                  <input
                    type="text"
                    required
                    value={artMedium}
                    onChange={(e) => setArtMedium(e.target.value)}
                    placeholder="e.g. Modeling Paste & Acrylic"
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Original Price ($) *</label>
                    <input
                      type="number"
                      required
                      value={artPrice}
                      onChange={(e) => setArtPrice(Number(e.target.value))}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Prints Price ($)</label>
                    <input
                      type="number"
                      required
                      value={artPrintPrice}
                      onChange={(e) => setArtPrintPrice(Number(e.target.value))}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Location of Inspiration</label>
                  <input
                    type="text"
                    value={artLocationInspiration}
                    onChange={(e) => setArtLocationInspiration(e.target.value)}
                    placeholder="e.g. Cox's Bazar Coastal Cliffs"
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Creative High-Res Image URL</label>
                  <input
                    type="text"
                    required
                    value={artImage}
                    onChange={(e) => setArtImage(e.target.value)}
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Emotional Short Subtitle *</label>
                  <textarea
                    required
                    rows={2}
                    value={artDesc}
                    onChange={(e) => setArtDesc(e.target.value)}
                    placeholder="A brief 1-2 sentence emotional subtitle..."
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Narrative Canvas Story *</label>
                  <textarea
                    required
                    rows={3}
                    value={artStory}
                    onChange={(e) => setArtStory(e.target.value)}
                    placeholder="Describe the deeper philosophical story of grinding minerals..."
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Handwritten Diary Entry</label>
                  <textarea
                    rows={2}
                    value={artHandwrittenNote}
                    onChange={(e) => setArtHandwrittenNote(e.target.value)}
                    placeholder="Personal note to include on the detailed view signed by Tanveen..."
                    className="w-full p-2.5 border border-soft-border rounded-xl bg-canvas-white text-base md:text-xs text-charcoal-ink focus:outline-none resize-none"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 bg-signature-carmine text-canvas-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-opacity-95 transition-all flex items-center justify-center space-x-1 shadow-lg"
                id="cms-submit-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Publish To Gallery</span>
              </button>
            </form>

            {/* Right side: Catalog Spreadsheet */}
            <div className="lg:col-span-7 bg-pure-white border border-soft-border rounded-3xl overflow-hidden shadow-xs">
              <div className="p-5 border-b border-soft-border/50">
                <h3 className="font-serif text-lg font-bold">Active Catalog ({artworks.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-canvas-white/60 text-slate-gray border-b border-soft-border uppercase tracking-wider font-mono text-[9px] font-semibold">
                      <th className="p-4">Artwork Details</th>
                      <th className="p-4">Theme</th>
                      <th className="p-4 text-right">Value</th>
                      <th className="p-4">Prints</th>
                      <th className="p-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artworks.map((art) => (
                      <tr key={art.id} className="border-b border-soft-border/50 hover:bg-canvas-white/20 transition-all">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg border border-soft-border bg-canvas-white overflow-hidden p-1 shrink-0 flex items-center justify-center">
                              <img src={art.image} alt={art.title} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-serif font-bold text-charcoal-ink block truncate max-w-[150px]">{art.title}</span>
                              <span className="text-[10px] text-slate-gray font-mono block">{art.size}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{art.theme}</td>
                        <td className="p-4 text-right font-serif font-bold text-charcoal-ink">${art.price.toLocaleString()}</td>
                        <td className="p-4">{art.printsAvailable ? `From $${art.printPrice}` : 'Original only'}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => deleteArtwork(art.id)}
                            className="p-1.5 text-slate-gray hover:text-signature-carmine transition-colors rounded-lg border border-transparent hover:border-soft-border"
                            id={`cms-delete-art-${art.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Orders Ledger management */}
        {activeTab === 'orders' && (
          <div className="bg-pure-white border border-soft-border rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-soft-border/50">
              <h3 className="font-serif text-lg font-bold">Acquisitions & Fulfillment Registry</h3>
            </div>
            
            {orders.length === 0 ? (
              <div className="py-16 text-center text-slate-gray">
                No orders registered inside the collector history ledger yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-canvas-white/60 text-slate-gray border-b border-soft-border uppercase tracking-wider font-mono text-[9px] font-semibold">
                      <th className="p-4">Collector</th>
                      <th className="p-4">Art Acquisitions</th>
                      <th className="p-4">Delivery Location</th>
                      <th className="p-4 text-right">Value</th>
                      <th className="p-4">Registry State</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-soft-border/50 hover:bg-canvas-white/20 transition-all">
                        <td className="p-4 font-sans">
                          <span className="font-bold text-charcoal-ink block">{order.customerName}</span>
                          <span className="text-[10px] text-slate-gray block">{order.customerEmail}</span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx}>
                                <span className="font-serif font-bold text-charcoal-ink">{item.title}</span>
                                <span className="text-[10px] text-signature-carmine block uppercase tracking-wider font-semibold">
                                  {item.optionType.replace('_', ' ')} ({item.size})
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="block truncate max-w-[150px]">{order.shippingAddress.street}</span>
                          <span className="text-[10px] text-slate-gray block">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </span>
                        </td>
                        <td className="p-4 text-right font-serif font-bold text-charcoal-ink">${order.totalPrice.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono capitalize font-bold ${
                            order.status === 'shipped' 
                              ? 'bg-green-50 border border-green-200 text-green-700' 
                              : order.status === 'crated'
                                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                                : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                          }`}>
                            {order.status === 'pending' ? 'Pending Crating' : order.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'crated')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] uppercase tracking-wider font-bold"
                            >
                              Crate
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-[9px] uppercase tracking-wider font-bold"
                            >
                              Ship
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Studio metrics & Sales Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 text-left">
            
            {/* Launch Security & Analytics Status Banner */}
            <div className="bg-[#FAF9F5] border border-soft-border/80 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-charcoal-ink">Collector Data Pipeline Active</span>
                </div>
                <p className="text-[11px] text-slate-gray font-light">
                  Production ready analytics and telemetry trackers loaded for launch. External scripts dynamically load securely on production domains.
                </p>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-2 text-[9px] font-mono uppercase tracking-wider font-bold">
                <span className="px-2.5 py-1.5 bg-[#EEECDF] border border-soft-border rounded-full flex items-center gap-1.5 text-charcoal-ink">
                  <Check className="w-3 h-3 text-emerald-600" /> GA4 Standard
                </span>
                <span className="px-2.5 py-1.5 bg-[#EEECDF] border border-soft-border rounded-full flex items-center gap-1.5 text-charcoal-ink">
                  <Check className="w-3 h-3 text-emerald-600" /> Tag Manager (GTM)
                </span>
                <span className="px-2.5 py-1.5 bg-[#EEECDF] border border-soft-border rounded-full flex items-center gap-1.5 text-charcoal-ink">
                  <Check className="w-3 h-3 text-emerald-600" /> MS Clarity
                </span>
                <span className="px-2.5 py-1.5 bg-[#EEECDF] border border-soft-border rounded-full flex items-center gap-1.5 text-charcoal-ink">
                  <Check className="w-3 h-3 text-emerald-600" /> Search Console
                </span>
              </div>
            </div>

            {/* Topline Dashboard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-signature-carmine/10 text-signature-carmine rounded-xl flex items-center justify-center shadow-xs">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">+18.4%</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-gray/70 font-mono font-bold pt-1">
                  Gross Revenue Accumulated
                </p>
                <h3 className="text-3xl font-serif font-bold text-charcoal-ink">
                  ${totalRevenue.toLocaleString()}
                </h3>
              </div>

              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#FAF9F5] text-charcoal-ink rounded-xl flex items-center justify-center shadow-xs">
                    <UserCheck className="w-5 h-5 text-signature-carmine" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-gray/70 font-mono font-bold pt-1">
                  Collector Sessions
                </p>
                <h3 className="text-3xl font-serif font-bold text-charcoal-ink">
                  {metrics.totalSessions}
                </h3>
              </div>

              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shadow-xs">
                    <Percent className="w-5 h-5 text-[#4A6B82]" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-gray/70 font-mono font-bold pt-1">
                  Conversion Rate (CVR)
                </p>
                <h3 className="text-3xl font-serif font-bold text-charcoal-ink font-mono">
                  {metrics.conversionRate}%
                </h3>
              </div>

              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-orange-50 text-orange-700 rounded-xl flex items-center justify-center shadow-xs">
                    <Activity className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-[10px] text-charcoal-ink font-mono font-bold bg-[#FAF9F5] px-2 py-0.5 rounded-full">{metrics.bounceRate}% BR</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-gray/70 font-mono font-bold pt-1">
                  Scroll Depth Engagement
                </p>
                <h3 className="text-3xl font-serif font-bold text-charcoal-ink font-mono">
                  {metrics.avgScrollDepth}%
                </h3>
              </div>

            </div>

            {/* Funnel and Engagement Column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Funnel Card */}
              <div className="lg:col-span-7 bg-pure-white border border-soft-border p-6 md:p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-soft-border/50 pb-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-charcoal-ink">Acquisition Conversion Pipeline</h4>
                    <p className="text-xs text-slate-gray font-light">Direct conversion funnel tracking across key interaction stages.</p>
                  </div>
                  <BarChart2 className="w-5 h-5 text-signature-carmine/70" />
                </div>

                <div className="space-y-5">
                  {[
                    { label: "1. Browse Exhibition (Gallery Views)", count: metrics.funnel.galleryViews, pct: 100, color: "bg-signature-carmine/20" },
                    { label: "2. Inspect Canvas (Artwork Details)", count: metrics.funnel.artworkDetailViews, pct: Math.round((metrics.funnel.artworkDetailViews / metrics.funnel.galleryViews) * 100), color: "bg-signature-carmine/40" },
                    { label: "3. Curate Favorites (Wishlist Clicks)", count: metrics.funnel.wishlistClicks, pct: Math.round((metrics.funnel.wishlistClicks / metrics.funnel.galleryViews) * 100), color: "bg-signature-carmine/60" },
                    { label: "4. Intent to Acquire (Cart Additions)", count: metrics.funnel.cartAdds, pct: Math.round((metrics.funnel.cartAdds / metrics.funnel.galleryViews) * 100), color: "bg-signature-carmine/80" },
                    { label: "5. Address Registry (Begin Checkout)", count: metrics.funnel.checkoutBegins, pct: Math.round((metrics.funnel.checkoutBegins / metrics.funnel.galleryViews) * 100), color: "bg-signature-carmine/90" },
                    { label: "6. Certified Acquisitions (Purchases)", count: metrics.funnel.purchases, pct: Math.round((metrics.funnel.purchases / metrics.funnel.galleryViews) * 100), color: "bg-signature-carmine font-bold" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-charcoal-ink">{item.label}</span>
                        <span className="font-mono text-slate-gray">
                          {item.count} events <span className="font-bold text-charcoal-ink ml-1.5">({item.pct}%)</span>
                        </span>
                      </div>
                      <div className="h-3.5 bg-[#FAF9F5] rounded-full overflow-hidden border border-soft-border/50">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Cards */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Scroll Depth Engagement Counts */}
                <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-soft-border/50 pb-3">
                    <h5 className="font-serif text-sm font-bold text-charcoal-ink">Scroll Depth Retention</h5>
                    <span className="text-[10px] font-mono uppercase bg-[#FAF9F5] px-2 py-0.5 rounded border border-soft-border">Compliant</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {(['25%', '50%', '75%', '100%'] as const).map((depth) => {
                      const count = metrics.scrollDepthCount[depth] || 0;
                      return (
                        <div key={depth} className="bg-[#FAF9F5]/80 p-3 rounded-2xl border border-soft-border/60">
                          <span className="text-[11px] font-bold text-signature-carmine font-mono block">{depth}</span>
                          <span className="text-lg font-serif font-bold text-charcoal-ink block mt-1">{count}</span>
                          <span className="text-[9px] font-sans text-slate-gray/70 block mt-0.5">readers</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Artworks Metrics */}
                <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                  <h5 className="font-serif text-sm font-bold text-charcoal-ink border-b border-soft-border/50 pb-3 flex items-center justify-between">
                    <span>In-Demand Paintings</span>
                    <Eye className="w-3.5 h-3.5 text-slate-gray" />
                  </h5>
                  <div className="space-y-3.5 font-sans">
                    {Object.entries(metrics.topArtworks).map(([title, views]) => (
                      <div key={title} className="flex items-center justify-between text-xs">
                        <span className="text-charcoal-ink font-medium truncate max-w-[200px]">{title}</span>
                        <div className="flex items-center space-x-2 font-mono text-slate-gray">
                          <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-soft-border text-[10px]">{views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Collections Metrics */}
                <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                  <h5 className="font-serif text-sm font-bold text-charcoal-ink border-b border-soft-border/50 pb-3 flex items-center justify-between">
                    <span>Thematic Series Popularity</span>
                    <Archive className="w-3.5 h-3.5 text-slate-gray" />
                  </h5>
                  <div className="space-y-3.5 font-sans">
                    {Object.entries(metrics.topCollections).map(([title, views]) => (
                      <div key={title} className="flex items-center justify-between text-xs">
                        <span className="text-charcoal-ink font-medium truncate max-w-[200px]">The {title} Series</span>
                        <div className="flex items-center space-x-2 font-mono text-slate-gray">
                          <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-soft-border text-[10px]">{views} hits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Lower row: Heatmap hotspots & Search Queries & Email List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive Heatmap Spotter */}
              <div className="lg:col-span-5 bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-soft-border/50 pb-3">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-charcoal-ink">Clarity Heatmap Spotter</h5>
                    <p className="text-[10px] text-slate-gray font-light">Recent coordinate clicks captured from actual collector sessions.</p>
                  </div>
                  <MousePointer className="w-4 h-4 text-signature-carmine" />
                </div>

                <div className="relative aspect-16/10 bg-[#FAF9F5] rounded-2xl border border-soft-border overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1c1c1c 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  <span className="text-[10px] uppercase tracking-widest font-mono text-slate-gray/50 z-0">Interactive Map Zone</span>
                  
                  {/* Dynamic Hotspots rendered physically! */}
                  {metrics.clickHotspots.slice(0, 15).map((spot, i) => (
                    <div 
                      key={i} 
                      className="absolute w-3.5 h-3.5 bg-signature-carmine/60 border border-signature-carmine rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      title={`Page: ${spot.page} | ID: ${spot.elementId || 'No ID'}`}
                    />
                  ))}
                  {metrics.clickHotspots.slice(0, 15).map((spot, i) => (
                    <div 
                      key={`static-${i}`} 
                      className="absolute w-2 h-2 bg-signature-carmine border border-pure-white rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-xs"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      title={`Page: ${spot.page} | ID: ${spot.elementId || 'No ID'}`}
                    />
                  ))}
                </div>

                <div className="text-[10px] font-sans text-slate-gray flex justify-between">
                  <span>Clicks captured: {metrics.clickHotspots.length}</span>
                  <span>Coordinate standard: percentage %</span>
                </div>
              </div>

              {/* Search Queries List */}
              <div className="lg:col-span-4 bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                <h5 className="font-serif text-sm font-bold text-charcoal-ink border-b border-soft-border/50 pb-3 flex items-center justify-between">
                  <span>Recent Internal Searches</span>
                  <Search className="w-3.5 h-3.5 text-slate-gray" />
                </h5>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {metrics.searchQueries.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-gray/60 font-light font-sans">No queries logged yet.</div>
                  ) : (
                    metrics.searchQueries.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-[#FAF9F5] p-2.5 rounded-xl border border-soft-border/40 font-sans">
                        <div className="space-y-0.5">
                          <span className="font-mono text-charcoal-ink font-bold">"{item.query}"</span>
                          <span className="text-[9px] text-slate-gray block">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-signature-carmine/10 text-signature-carmine px-2 py-0.5 rounded-full font-bold">
                          {item.count} searches
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Newsletter Signups list */}
              <div className="lg:col-span-3 bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4">
                <h5 className="font-serif text-sm font-bold text-charcoal-ink border-b border-soft-border/50 pb-3 flex items-center justify-between">
                  <span>Studio Mailing List</span>
                  <Award className="w-3.5 h-3.5 text-slate-gray" />
                </h5>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {metrics.newsletterSignups.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-gray/60 font-light font-sans">No subscribers yet.</div>
                  ) : (
                    metrics.newsletterSignups.map((sub, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-soft-border bg-[#FAF9F5]/40 text-xs truncate space-y-1 font-sans">
                        <p className="font-medium text-charcoal-ink truncate">{sub.email}</p>
                        <span className="text-[8px] font-mono text-slate-gray block">Subscribed {new Date(sub.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Explanatory Trust Footer block */}
            <div className="bg-pure-white border border-soft-border p-6 md:p-8 rounded-3xl space-y-4">
              <h4 className="font-serif text-lg font-bold text-charcoal-ink">Collector Engagement Summary</h4>
              <p className="text-xs text-slate-gray leading-relaxed max-w-2xl font-light">
                The studio represents an organic physical workspace. This panel records virtual acquisitions. Real physical canvases are cataloged with custom tracking codes and physical micro-chips to protect against digital replication forgery. All tracking coordinates respect GDPR / CCPA cookie consent and privacy standards natively.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Ecosystem & Artists Management */}
        {activeTab === 'artists' && (
          <div className="space-y-10">
            {/* Upper stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-gray">Ecosystem Artists</span>
                  <h4 className="text-2xl font-serif font-bold text-charcoal-ink mt-1">{artists.length} Registry</h4>
                </div>
                <UserCheck className="w-8 h-8 text-signature-carmine/30" />
              </div>
              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-gray">Commission Solicitations</span>
                  <h4 className="text-2xl font-serif font-bold text-charcoal-ink mt-1">
                    {commissions.length} Requests
                  </h4>
                </div>
                <LineChart className="w-8 h-8 text-signature-carmine/30" />
              </div>
              <div className="bg-pure-white border border-soft-border p-6 rounded-3xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-gray">Active Guest Applications</span>
                  <h4 className="text-2xl font-serif font-bold text-charcoal-ink mt-1">
                    {applications.filter(a => a.status === 'Pending').length} Pending
                  </h4>
                </div>
                <Activity className="w-8 h-8 text-signature-carmine/30" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Registered Artists Registry List */}
              <div className="lg:col-span-5 bg-pure-white border border-soft-border p-6 rounded-3xl space-y-6">
                <div className="border-b border-soft-border/50 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-charcoal-ink">Ecosystem Registry</h3>
                    <p className="text-[10px] text-slate-gray font-light">Verified artists exhibiting and managing collections.</p>
                  </div>
                  <Award className="w-4 h-4 text-signature-carmine" />
                </div>

                <div className="space-y-4">
                  {artists.map((artist) => (
                    <div key={artist.id} className="p-4 rounded-2xl border border-soft-border/60 bg-[#FAF9F5]/40 flex items-start space-x-4">
                      <img 
                        src={artist.avatar} 
                        alt={artist.name} 
                        className="w-12 h-12 rounded-full object-cover border border-soft-border/80" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-sm text-charcoal-ink">{artist.name}</h4>
                          <span className={`text-[8px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full ${
                            artist.role === 'Featured Artist' ? 'bg-signature-carmine/10 text-signature-carmine font-bold' : 'bg-slate-gray/10 text-slate-gray'
                          }`}>
                            {artist.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-gray line-clamp-2">{artist.bio}</p>
                        <div className="pt-2 flex justify-between items-center text-[10px] text-slate-gray border-t border-soft-border/30 mt-2 font-mono">
                          <span>{artist.location}</span>
                          <span className="font-bold text-charcoal-ink">${artist.earnings.toLocaleString()} earned</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Applications & Commission Review Streams */}
              <div className="lg:col-span-7 space-y-8">
                {/* Section A: Guest Applications */}
                <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-6">
                  <div className="border-b border-soft-border/50 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal-ink">Artist Applications</h3>
                      <p className="text-[10px] text-slate-gray font-light">Exhibiting requests from independent high-tactility artists.</p>
                    </div>
                    <FileText className="w-4 h-4 text-slate-gray" />
                  </div>

                  {applications.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-gray/60 font-sans font-light">No applications registered.</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="p-4 rounded-2xl border border-soft-border/80 bg-canvas-white space-y-3 relative overflow-hidden">
                          {/* Banner status */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-bold text-sm text-charcoal-ink">{app.name}</h4>
                              <p className="text-[10px] text-slate-gray font-mono">{app.email} | {app.portfolioUrl}</p>
                            </div>
                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                              app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-gray font-light leading-relaxed">
                            <span className="font-medium text-charcoal-ink block mb-1">Artist Statement:</span>
                            "{app.statement}"
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {app.mediums.map((med, idx) => (
                              <span key={idx} className="text-[9px] bg-[#FAF9F5] border border-soft-border text-slate-gray px-2 py-0.5 rounded">
                                {med}
                              </span>
                            ))}
                          </div>

                          {app.status === 'Pending' && (
                            <div className="pt-3 border-t border-soft-border/40 flex justify-end space-x-3">
                              <button
                                onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => updateApplicationStatus(app.id, 'Approved')}
                                className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition"
                              >
                                Approve & License
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section B: Custom Commissions requests */}
                <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-6">
                  <div className="border-b border-soft-border/50 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal-ink">Custom Commissions</h3>
                      <p className="text-[10px] text-slate-gray font-light">Direct commissioned canvas solicitations from collectors.</p>
                    </div>
                    <SlidersHorizontal className="w-4 h-4 text-slate-gray" />
                  </div>

                  {commissions.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-gray/60 font-sans font-light">No custom commission proposals yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {commissions.map((comm) => (
                        <div key={comm.id} className="p-4 rounded-2xl border border-soft-border/80 bg-canvas-white space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-bold text-sm text-charcoal-ink">Proposal from {comm.clientName}</h4>
                              <p className="text-[10px] text-slate-gray font-mono">{comm.clientEmail} | Budget: ${comm.budget?.toLocaleString()}</p>
                            </div>
                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                              comm.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              comm.status === 'In_Progress' ? 'bg-blue-100 text-blue-800' :
                              comm.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {comm.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-xs text-slate-gray font-light leading-relaxed">
                            <span className="font-medium text-charcoal-ink block mb-1">Canvas Description & Intended Location:</span>
                            "{comm.description}"
                          </div>

                          <div className="text-xs text-slate-gray font-light flex justify-between pt-1">
                            <span>Requested Dimensions: <strong className="text-charcoal-ink">{comm.dimensions}</strong></span>
                            <span>Date: <strong className="text-charcoal-ink">{comm.date}</strong></span>
                          </div>

                          <div className="pt-3 border-t border-soft-border/40 flex justify-end space-x-2">
                            {comm.status === 'Requested' && (
                              <>
                                <button
                                  onClick={() => updateCommissionStatus(comm.id, 'Declined')}
                                  className="px-2.5 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded text-xs transition"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => updateCommissionStatus(comm.id, 'In_Progress')}
                                  className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs transition"
                                >
                                  Accept & Start Painting
                                </button>
                              </>
                            )}
                            {comm.status === 'In_Progress' && (
                              <button
                                onClick={() => updateCommissionStatus(comm.id, 'Completed')}
                                className="px-2.5 py-1 text-green-700 bg-green-50 hover:bg-green-100 rounded text-xs transition"
                              >
                                Mark as Completed & Dispatch COA
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Dynamic Site Settings, Ecosystem Feature Flags, & Repository Drivers */}
        {activeTab === 'settings' && (
          <div className="space-y-10 animate-fade-in">
            {/* Row 1: Data Repository Switching */}
            <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="border-b border-soft-border/50 pb-3">
                <h3 className="font-serif text-lg font-bold text-charcoal-ink flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-signature-carmine animate-pulse" />
                  Centralized Data Repository Drivers
                </h3>
                <p className="text-xs text-slate-gray font-light">
                  Toggle between data source drivers instantly. The Service Repository Pattern handles the data switching with zero component modifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { value: 'mock', name: 'Mock Data Driver (Default)', desc: 'Reads and writes to simulated, latenced localStorage. Ready for instant offline-first deployment.' },
                  { value: 'rest', name: 'REST API Driver (Future)', desc: 'Queries future JSON REST web services. Uses standard async executeFetch proxy blocks.' },
                  { value: 'graphql', name: 'GraphQL Driver (Future)', desc: 'Routes queries through custom GraphQL queries. Leverages client repository schemas.' }
                ].map((driver) => (
                  <button
                    key={driver.value}
                    onClick={() => changeDataSource(driver.value as any)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      activeDataSource === driver.value
                        ? 'border-signature-carmine bg-signature-carmine/5 shadow-xs'
                        : 'border-soft-border bg-canvas-white hover:bg-studio-mist/20'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        activeDataSource === driver.value ? 'text-signature-carmine' : 'text-slate-gray'
                      }`}>
                        {driver.value} Provider
                      </span>
                      <h4 className="font-serif font-bold text-sm text-charcoal-ink mt-1">
                        {driver.name}
                      </h4>
                      <p className="text-[11px] text-slate-gray leading-normal mt-2">
                        {driver.desc}
                      </p>
                    </div>
                    {activeDataSource === driver.value && (
                      <span className="text-[10px] font-mono text-signature-carmine uppercase tracking-widest mt-4 font-bold">
                        ● Driver Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Page Configurations & Editorial Style */}
            <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-6 shadow-xs">
              <div className="border-b border-soft-border/50 pb-3">
                <h3 className="font-serif text-lg font-bold text-charcoal-ink">
                  CMS Page Content & Style Configurations
                </h3>
                <p className="text-xs text-slate-gray font-light">
                  Update dynamic editorial elements globally without rebuilding or altering frontend source files.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-gray">
                {/* Announcement Controls */}
                <div className="space-y-4 border border-soft-border/50 p-4 rounded-2xl bg-canvas-white">
                  <h4 className="font-serif font-bold text-sm text-charcoal-ink">Announcement Banner Block</h4>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="announcement-visible"
                      checked={siteSettings.announcement?.visible}
                      onChange={(e) => updateSiteSettings({ 
                        announcement: { 
                          ...siteSettings.announcement, 
                          visible: e.target.checked 
                        } 
                      })}
                      className="rounded border-soft-border text-signature-carmine focus:ring-signature-carmine cursor-pointer"
                    />
                    <label htmlFor="announcement-visible" className="cursor-pointer font-medium text-charcoal-ink">
                      Display Announcement Bar at Top of Page
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block">Announcement Text Message</label>
                    <input
                      type="text"
                      value={siteSettings.announcement?.text || ''}
                      onChange={(e) => updateSiteSettings({
                        announcement: {
                          ...siteSettings.announcement,
                          text: e.target.value
                        }
                      })}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-pure-white text-charcoal-ink text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Aesthetic Theme Override Controls */}
                <div className="space-y-4 border border-soft-border/50 p-4 rounded-2xl bg-canvas-white">
                  <h4 className="font-serif font-bold text-sm text-charcoal-ink">Visual Aesthetic Properties</h4>

                  <div className="space-y-1">
                    <label className="font-semibold block">Studio Title Name</label>
                    <input
                      type="text"
                      value={siteSettings.title || ''}
                      onChange={(e) => updateSiteSettings({ title: e.target.value })}
                      className="w-full p-2.5 border border-soft-border rounded-xl bg-pure-white text-charcoal-ink text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold block">Header Height style</label>
                      <select
                        value={siteSettings.headerHeight || 'medium'}
                        onChange={(e) => updateSiteSettings({ headerHeight: e.target.value as any })}
                        className="w-full p-2.5 border border-soft-border rounded-xl bg-pure-white text-charcoal-ink text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="small">Small (60px)</option>
                        <option value="medium">Medium (80px)</option>
                        <option value="large">Large (100px)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold block">Section Visibility style</label>
                      <select
                        value={siteSettings.backgroundStyle || 'mist'}
                        onChange={(e) => updateSiteSettings({ backgroundStyle: e.target.value as any })}
                        className="w-full p-2.5 border border-soft-border rounded-xl bg-pure-white text-charcoal-ink text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="white">Pristine White</option>
                        <option value="mist">Studio Moss Mist</option>
                        <option value="dark">Charcoal Velvet Dark</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Hidden Extensibility Feature Flags */}
            <div className="bg-pure-white border border-soft-border p-6 rounded-3xl space-y-6 shadow-xs">
              <div className="border-b border-soft-border/50 pb-3">
                <h3 className="font-serif text-lg font-bold text-charcoal-ink">
                  Ecosystem Feature Flags (Hidden Extensibility)
                </h3>
                <p className="text-xs text-slate-gray font-light">
                  Release modular ecosystem tabs, multi-author profiles, verification registers, and commission pipelines instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: 'multipleArtists', label: 'Multiple Artists Mode', desc: 'Allows directory and bio boards for Guest Creators.' },
                  { key: 'artistProfiles', label: 'Detailed Artist Profiles', desc: 'Enables custom portfolios for curated gallery co-creators.' },
                  { key: 'artistVerification', label: 'Artist Verification Stamp', desc: 'Attaches a secured registry mark to co-creators.' },
                  { key: 'guestArtists', label: 'Guest Artists', desc: 'Allows external creators to submit workspace applications.' },
                  { key: 'curators', label: 'Curator Profiles', desc: 'Enables editorial notes and curatorial collection overlays.' },
                  { key: 'galleryPartners', label: 'Gallery Partners', desc: 'Unlocks dedicated spaces for affiliated gallery collections.' },
                  { key: 'artistApplications', label: 'Artist Applications Panel', desc: 'Unlocks external application entry portals.' },
                  { key: 'artistDashboards', label: 'Co-Creator Dashboards', desc: 'Enables specialized studio panels for licensed artists.' },
                  { key: 'artistAnalytics', label: 'Co-Creator Analytics', desc: 'Calculates specific engagement, vistas and reach figures.' },
                  { key: 'artistEarnings', label: 'Earnings Ledger', desc: 'Calculates sales margins and payout rosters securely.' },
                  { key: 'commissionRequests', label: 'Commission Pipelines', desc: 'Allows direct commission solicitations from collectors.' }
                ].map((flag) => {
                  const isEnabled = !!(featureFlags as any)[flag.key];
                  return (
                    <div 
                      key={flag.key}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isEnabled 
                          ? 'border-signature-carmine bg-signature-carmine/[0.02]' 
                          : 'border-soft-border bg-[#FAFAFA]'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                          isEnabled ? 'text-signature-carmine' : 'text-slate-gray'
                        }`}>
                          {isEnabled ? '● Active Release' : '○ Standby'}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-charcoal-ink">
                          {flag.label}
                        </h4>
                        <p className="text-[11px] text-slate-gray leading-normal">
                          {flag.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFeatureFlag(flag.key as any)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer flex-shrink-0 ${
                          isEnabled ? 'bg-signature-carmine' : 'bg-slate-gray/30'
                        }`}
                        aria-label={`Toggle ${flag.label}`}
                      >
                        <div className={`bg-canvas-white w-4 h-4 rounded-full shadow-md transition-transform ${
                          isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
