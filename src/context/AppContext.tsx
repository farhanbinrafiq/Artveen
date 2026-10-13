/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Artwork, Collection, JournalPost, CartItem, Order, User, Artist, ArtistApplication, CommissionRequest, TimelineEvent } from '../types';

// Centralized Services imports
import { ArtistService } from '../services/ArtistService';
import { ArtworkService } from '../services/ArtworkService';
import { CollectionService } from '../services/CollectionService';
import { JournalService } from '../services/JournalService';
import { ExhibitionService } from '../services/ExhibitionService';
import { CommissionService } from '../services/CommissionService';
import { CollectorService } from '../services/CollectorService';
import { SiteSettingsService } from '../services/SiteSettingsService';
import { NotificationService, SystemNotification } from '../services/NotificationService';
import { getActiveDataSource, setActiveDataSource as setApiDataSource, DataSourceType } from '../services/api';
import { FeatureFlags, SiteSettings, DEFAULT_FEATURE_FLAGS, DEFAULT_SITE_SETTINGS } from '../services/config';

interface AppContextType {
  // Core datasets
  artworks: Artwork[];
  collections: Collection[];
  journal: JournalPost[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: User;
  currentRoute: string;
  selectedArtworkId: string | null;
  selectedJournalId: string | null;
  selectedCollectionId: string | null;
  searchQuery: string;
  audioEnabled: boolean;
  
  // Service Extensibilities
  artists: Artist[];
  activeArtistId: string;
  applications: ArtistApplication[];
  commissions: CommissionRequest[];
  timelineEvents: TimelineEvent[];
  
  // API Integration, Loading & Fault Tolerance States
  loading: boolean;
  error: string | null;
  activeDataSource: DataSourceType;
  featureFlags: FeatureFlags;
  siteSettings: SiteSettings;
  notifications: SystemNotification[];

  // Actions
  setRoute: (route: string, id?: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleWishlist: (artworkId: string) => void;
  addToCart: (artwork: Artwork, optionType: 'original' | 'canvas_print' | 'fine_art_print', size: string, price: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (name: string, email: string, address: Order['shippingAddress'], autoRoute?: boolean) => Promise<Order | null>;
  switchUserRole: (role: User['role']) => void;
  toggleAudio: () => void;
  setActiveArtistId: (id: string) => void;
  changeDataSource: (source: DataSourceType) => void;
  retryFetch: () => void;
  triggerNotification: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;

  // CMS Actions
  addArtwork: (artwork: Omit<Artwork, 'id'> & { id?: string }) => Promise<void>;
  updateArtwork: (artwork: Artwork) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  addCollection: (collection: Collection) => Promise<void>;
  updateCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addJournalPost: (post: JournalPost) => Promise<void>;
  updateJournalPost: (post: JournalPost) => Promise<void>;
  deleteJournalPost: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], tracking?: string) => Promise<void>;
  
  // Artist CMS & Extensibility Actions
  addArtist: (artist: Artist) => Promise<void>;
  updateArtist: (artist: Artist) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
  submitApplication: (app: Omit<ArtistApplication, 'id' | 'status' | 'date'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ArtistApplication['status']) => Promise<void>;
  submitCommissionRequest: (request: Omit<CommissionRequest, 'id' | 'status' | 'date'>) => Promise<void>;
  updateCommissionStatus: (id: string, status: CommissionRequest['status']) => Promise<void>;
  addTimelineEvent: (event: TimelineEvent) => Promise<void>;
  updateTimelineEvent: (event: TimelineEvent) => Promise<void>;
  deleteTimelineEvent: (id: string) => Promise<void>;

  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load repository switch & settings
  const [activeDataSource, setActiveDataSourceState] = useState<DataSourceType>(() => getActiveDataSource());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Core state datasets (populated on-demand or mounted via centralized services)
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeArtistId, setActiveArtistIdState] = useState<string>('tanveen');
  const [applications, setApplications] = useState<ArtistApplication[]>([]);
  const [commissions, setCommissions] = useState<CommissionRequest[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [journal, setJournal] = useState<JournalPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Cart & Wishlist (local client preferences)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('art_escape_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>([]);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('art_escape_user');
      return saved ? JSON.parse(saved) : { name: 'Guest Collector', email: 'collector@escape.com', role: 'guest' };
    }
    return { name: 'Guest Collector', email: 'collector@escape.com', role: 'guest' };
  });

  // Routing and UI Navigation States
  const [currentRoute, setCurrentRouteState] = useState<string>('home');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Performance, Skeleton loaders & Error resilience state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cinematic Ambient Sough (Studio Sound Synthesis)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; filter: BiquadFilterNode; gain1: GainNode; gain2: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null>(null);

  // Initialize and load all datasets through services
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Run queries concurrently via dynamic services
      const [
        fetchedSettings,
        fetchedArtworks,
        fetchedArtists,
        fetchedCollections,
        fetchedJournal,
        fetchedTimeline,
        fetchedApps,
        fetchedComms,
        fetchedOrders
      ] = await Promise.all([
        SiteSettingsService.getSettings(),
        ArtworkService.getArtworks(),
        ArtistService.getArtists(),
        CollectionService.getCollections(),
        JournalService.getJournalPosts(),
        ExhibitionService.getTimelineEvents(),
        ArtistService.getApplications(),
        CommissionService.getCommissions(),
        CollectorService.getOrders()
      ]);

      // Populate local states
      setSiteSettings(fetchedSettings);
      setArtworks(fetchedArtworks);
      setArtists(fetchedArtists);
      setCollections(fetchedCollections);
      setJournal(fetchedJournal);
      setTimelineEvents(fetchedTimeline);
      setApplications(fetchedApps);
      setCommissions(fetchedComms);
      setOrders(fetchedOrders);

      // Resolve user's personalized items
      if (currentUser?.email) {
        const fetchedWish = await CollectorService.getWishlist(currentUser.email);
        setWishlist(fetchedWish);
      }

      setFeatureFlags(SiteSettingsService.getFeatureFlags());
      setNotifications(NotificationService.getSessionNotifications());
    } catch (err: any) {
      console.error('[Ecosystem Hydration Failed]', err);
      setError(err.message || 'The gallery server did not respond to vernissage parameters. Restoring offline assets.');
      NotificationService.notify('error', 'Hydration Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentUser?.email]);

  // Subscribe to push notification services
  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((notif) => {
      setNotifications(prev => [notif, ...prev]);
      NotificationService.saveSessionNotification(notif);
    });
    return unsubscribe;
  }, []);

  // Sync client-only states to local storage
  useEffect(() => {
    localStorage.setItem('art_escape_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('art_escape_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Dynamic router trigger
  const setRoute = (route: string, id: string | null = null) => {
    setCurrentRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route === 'artwork-detail') {
      setSelectedArtworkId(id);
    } else if (route === 'journal-detail') {
      setSelectedJournalId(id);
    } else if (route === 'collection-detail') {
      setSelectedCollectionId(id);
    } else {
      if (route !== 'cms' && route !== 'portal') {
        setSelectedArtworkId(null);
        setSelectedJournalId(null);
        setSelectedCollectionId(null);
      }
    }
  };

  // Change data sources & reload application
  const changeDataSource = (source: DataSourceType) => {
    setActiveDataSourceState(source);
    setApiDataSource(source);
  };

  const retryFetch = () => {
    fetchAllData();
  };

  const triggerNotification = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    NotificationService.notify(type, title, message);
  };

  // Switch between roles
  const switchUserRole = (role: User['role']) => {
    const userMap: Record<User['role'], User> = {
      guest: { name: 'Guest Collector', email: 'collector@escape.com', role: 'guest' },
      collector: { name: 'Sarah Jenkins', email: 'sarah.jenkins@gmail.com', role: 'collector' },
      admin: { name: 'Tanveen (Artist)', email: 'tanveen@artescape.com', role: 'admin' },
    };
    setCurrentUser(userMap[role]);
    if (currentRoute === 'cms' && role !== 'admin') {
      setRoute('home');
    }
  };

  const toggleWishlist = async (artworkId: string) => {
    if (!currentUser?.email) return;
    try {
      const updatedWishlist = await CollectorService.toggleWishlist(currentUser.email, artworkId);
      setWishlist(updatedWishlist);
    } catch (err: any) {
      triggerNotification('error', 'Wishlist Error', err.message);
    }
  };

  const addToCart = (artwork: Artwork, optionType: 'original' | 'canvas_print' | 'fine_art_print', size: string, price: number) => {
    const cartItemId = `${artwork.id}-${optionType}-${size.replace(/\s+/g, '')}`;
    
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx > -1) {
        if (optionType === 'original') return prev;
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        const newItem: CartItem = {
          cartItemId,
          artworkId: artwork.id,
          title: artwork.title,
          image: artwork.image,
          optionType,
          size,
          price,
          quantity: 1
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  // Place Acquisition Order (Checkout Flow)
  const placeOrder = async (name: string, email: string, address: Order['shippingAddress'], autoRoute: boolean = true): Promise<Order | null> => {
    if (cart.length === 0) return null;
    try {
      setLoading(true);
      const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      const order = await CollectorService.submitOrder({
        customerName: name,
        customerEmail: email,
        items: [...cart],
        total,
        shippingAddress: address
      });

      // Update local state reactive copies
      setOrders(prev => [order, ...prev]);
      
      const originalItemIds = cart
        .filter(item => item.optionType === 'original')
        .map(item => item.artworkId);
        
      if (originalItemIds.length > 0) {
        setArtworks(prev => prev.map(art => 
          originalItemIds.includes(art.id) ? { ...art, isSold: true } : art
        ));
      }

      clearCart();
      triggerNotification('success', 'Acquisition Documented', `Order ${order.id} has been registered.`);
      if (autoRoute) {
        setRoute('portal');
      }
      return order;
    } catch (err: any) {
      triggerNotification('error', 'Checkout failed', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // CMS: Manage Artworks
  const addArtwork = async (artwork: Omit<Artwork, 'id'> & { id?: string }) => {
    try {
      const completeArt: Artwork = {
        ...artwork,
        id: artwork.id || `tanveen-canvas-${Math.floor(100 + Math.random() * 900)}`
      };
      await ArtworkService.saveArtwork(completeArt);
      setArtworks(prev => [completeArt, ...prev]);
      triggerNotification('success', 'Artwork Logged', `"${completeArt.title}" has been curated successfully.`);
    } catch (err: any) {
      triggerNotification('error', 'Artwork Curating Failed', err.message);
    }
  };

  const updateArtwork = async (updated: Artwork) => {
    try {
      await ArtworkService.saveArtwork(updated);
      setArtworks(prev => prev.map(art => art.id === updated.id ? updated : art));
      triggerNotification('success', 'Artwork Synchronized', `Metadata for "${updated.title}" updated.`);
    } catch (err: any) {
      triggerNotification('error', 'Update Failed', err.message);
    }
  };

  const deleteArtwork = async (id: string) => {
    try {
      await ArtworkService.deleteArtwork(id);
      setArtworks(prev => prev.filter(art => art.id !== id));
      triggerNotification('info', 'Artwork Removed', 'The artwork was deleted from active curation catalogs.');
    } catch (err: any) {
      triggerNotification('error', 'Deletion Refused', err.message);
    }
  };

  // CMS: Manage Collections
  const addCollection = async (col: Collection) => {
    try {
      await CollectionService.saveCollection(col);
      setCollections(prev => [...prev, col]);
      triggerNotification('success', 'Curator Room Registered', `Room "${col.title}" added.`);
    } catch (err: any) {
      triggerNotification('error', 'Creation Failed', err.message);
    }
  };

  const updateCollection = async (updated: Collection) => {
    try {
      await CollectionService.saveCollection(updated);
      setCollections(prev => prev.map(col => col.id === updated.id ? updated : col));
      triggerNotification('success', 'Curation Room Updated', `Room details for "${updated.title}" updated.`);
    } catch (err: any) {
      triggerNotification('error', 'Update Failed', err.message);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await CollectionService.deleteCollection(id);
      setCollections(prev => prev.filter(col => col.id !== id));
      triggerNotification('info', 'Curator Room Dismantled', 'Collection removed successfully.');
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  // CMS: Manage Journal Posts
  const addJournalPost = async (post: JournalPost) => {
    try {
      await JournalService.saveJournalPost(post);
      setJournal(prev => [post, ...prev]);
      triggerNotification('success', 'Journal Released', `Story "${post.title}" published.`);
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  const updateJournalPost = async (updated: JournalPost) => {
    try {
      await JournalService.saveJournalPost(updated);
      setJournal(prev => prev.map(post => post.id === updated.id ? updated : post));
      triggerNotification('success', 'Journal Updated', `"${updated.title}" updated.`);
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  const deleteJournalPost = async (id: string) => {
    try {
      await JournalService.deleteJournalPost(id);
      setJournal(prev => prev.filter(post => post.id !== id));
      triggerNotification('info', 'Log Removed', 'The journal post has been archived.');
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  // CMS: Update Order Status
  const updateOrderStatus = async (orderId: string, status: Order['status'], tracking?: string) => {
    try {
      await CollectorService.updateOrderStatus(orderId, status, tracking);
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, trackingNumber: tracking || order.trackingNumber } 
          : order
      ));
      triggerNotification('success', 'Acquisition Updated', `Order ${orderId} marked as ${status}.`);
    } catch (err: any) {
      triggerNotification('error', 'Status Update Refused', err.message);
    }
  };

  // Artist Actions
  const addArtist = async (artist: Artist) => {
    try {
      await ArtistService.saveArtist(artist);
      setArtists(prev => [...prev, artist]);
      triggerNotification('success', 'Artist Enrolled', `"${artist.name}" added to registry.`);
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  const updateArtist = async (updated: Artist) => {
    try {
      await ArtistService.saveArtist(updated);
      setArtists(prev => prev.map(art => art.id === updated.id ? updated : art));
      triggerNotification('success', 'Artist Bio Updated', `Bios for "${updated.name}" updated.`);
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  const deleteArtist = async (id: string) => {
    try {
      await ArtistService.deleteArtist(id);
      setArtists(prev => prev.filter(art => art.id !== id));
      triggerNotification('info', 'Artist Removed', 'The artist has been de-registered.');
    } catch (err: any) {
      triggerNotification('error', 'Failed', err.message);
    }
  };

  const submitApplication = async (app: Omit<ArtistApplication, 'id' | 'status' | 'date'>) => {
    try {
      const newApp = await ArtistService.submitApplication(app);
      setApplications(prev => [newApp, ...prev]);
      triggerNotification('success', 'Application Dispatched', 'curatorial boards will review your application in 48h.');
    } catch (err: any) {
      triggerNotification('error', 'Submission Failed', err.message);
    }
  };

  const updateApplicationStatus = async (id: string, status: ArtistApplication['status']) => {
    try {
      const updated = await ArtistService.updateApplicationStatus(id, status);
      if (updated) {
        setApplications(prev => prev.map(app => app.id === id ? updated : app));
        // Side-effect:approved status appends artist, which we resolve by fetching
        const fetchedArtists = await ArtistService.getArtists();
        setArtists(fetchedArtists);
        triggerNotification('info', 'Application Status Updated', `Application has been marked as ${status}.`);
      }
    } catch (err: any) {
      triggerNotification('error', 'Update Failed', err.message);
    }
  };

  const submitCommissionRequest = async (request: Omit<CommissionRequest, 'id' | 'status' | 'date'>) => {
    try {
      const newRequest = await CommissionService.submitCommission(request);
      setCommissions(prev => [newRequest, ...prev]);
      triggerNotification('success', 'Commission Sent', 'The artist has been notified in their workspace.');
    } catch (err: any) {
      triggerNotification('error', 'Request Failed', err.message);
    }
  };

  const updateCommissionStatus = async (id: string, status: CommissionRequest['status']) => {
    try {
      const updated = await CommissionService.updateCommissionStatus(id, status);
      if (updated) {
        setCommissions(prev => prev.map(comm => comm.id === id ? updated : comm));
        triggerNotification('info', 'Commission Updated', `Commission status set to ${status.replace('_', ' ')}.`);
      }
    } catch (err: any) {
      triggerNotification('error', 'Update Failed', err.message);
    }
  };

  const addTimelineEvent = async (event: TimelineEvent) => {
    setTimelineEvents(prev => [...prev, event]);
  };

  const updateTimelineEvent = async (updated: TimelineEvent) => {
    setTimelineEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
  };

  const deleteTimelineEvent = async (id: string) => {
    setTimelineEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const toggleFeatureFlag = (flag: keyof FeatureFlags) => {
    const updated = { ...featureFlags, [flag]: !featureFlags[flag] };
    setFeatureFlags(updated);
    SiteSettingsService.saveFeatureFlags(updated);
    triggerNotification('success', 'Feature Flag Updated', `Feature state changed.`);
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    SiteSettingsService.saveSettings(updated);
    triggerNotification('success', 'Settings Synchronized', 'Site configurations synchronized.');
  };

  const setActiveArtistId = (id: string) => {
    setActiveArtistIdState(id);
  };

  // Sound Synth Synthesizer for local premium atmosphere
  const toggleAudio = () => {
    if (audioEnabled) {
      const nodes = synthNodesRef.current;
      const ctx = audioContextRef.current;
      if (nodes && ctx) {
        try {
          const fadeTime = 1.5;
          nodes.gain1.gain.setValueAtTime(nodes.gain1.gain.value, ctx.currentTime);
          nodes.gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeTime);
          nodes.gain2.gain.setValueAtTime(nodes.gain2.gain.value, ctx.currentTime);
          nodes.gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeTime);
          
          setTimeout(() => {
            if (!audioEnabled) {
              nodes.osc1.disconnect();
              nodes.osc2.disconnect();
              nodes.lfo.disconnect();
              nodes.filter.disconnect();
              ctx.suspend();
            }
          }, fadeTime * 1000);
        } catch (e) {
          console.error('Audio synthesizer stop failure:', e);
        }
      }
      setAudioEnabled(false);
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(140, ctx.currentTime);
          filter.Q.setValueAtTime(2.0, ctx.currentTime);

          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(45, ctx.currentTime);

          const osc2 = ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(65, ctx.currentTime);

          const gain1 = ctx.createGain();
          gain1.gain.setValueAtTime(0.0, ctx.currentTime);

          const gain2 = ctx.createGain();
          gain2.gain.setValueAtTime(0.0, ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.setValueAtTime(0.14, ctx.currentTime);

          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(45, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);

          osc1.connect(gain1);
          osc2.connect(gain2);

          gain1.connect(filter);
          gain2.connect(filter);

          filter.connect(ctx.destination);

          osc1.start();
          osc2.start();
          lfo.start();

          synthNodesRef.current = { osc1, osc2, filter, gain1, gain2, lfo, lfoGain };
        }

        const ctx = audioContextRef.current;
        const nodes = synthNodesRef.current;
        if (ctx && nodes) {
          ctx.resume();
          nodes.gain1.gain.setValueAtTime(0, ctx.currentTime);
          nodes.gain1.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.0);
          nodes.gain2.gain.setValueAtTime(0, ctx.currentTime);
          nodes.gain2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.0);
        }
        setAudioEnabled(true);
      } catch (e) {
        console.error('Audio synthesizer start failure:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <AppContext.Provider value={{
      artworks,
      collections,
      journal,
      cart,
      wishlist,
      orders,
      currentUser,
      currentRoute,
      selectedArtworkId,
      selectedJournalId,
      selectedCollectionId,
      searchQuery,
      audioEnabled,
      
      artists,
      activeArtistId,
      applications,
      commissions,
      timelineEvents,
      
      loading,
      error,
      activeDataSource,
      featureFlags,
      siteSettings,
      notifications,
      
      setRoute,
      setSearchQuery,
      toggleWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      switchUserRole,
      toggleAudio,
      setActiveArtistId,
      changeDataSource,
      retryFetch,
      triggerNotification,

      addArtwork,
      updateArtwork,
      deleteArtwork,
      addCollection,
      updateCollection,
      deleteCollection,
      addJournalPost,
      updateJournalPost,
      deleteJournalPost,
      updateOrderStatus,

      addArtist,
      updateArtist,
      deleteArtist,
      submitApplication,
      updateApplicationStatus,
      submitCommissionRequest,
      updateCommissionStatus,
      addTimelineEvent,
      updateTimelineEvent,
      deleteTimelineEvent,
      
      toggleFeatureFlag,
      updateSiteSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
