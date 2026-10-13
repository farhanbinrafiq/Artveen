/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Artist {
  id: string;
  name: string;
  slug: string;
  role: 'Featured Artist' | 'Guest Artist' | 'Curator' | 'Gallery Partner';
  avatar: string;
  bio: string;
  story: string;
  verified: boolean;
  location: string;
  featured: boolean;
  socials: {
    instagram?: string;
    pinterest?: string;
    website?: string;
  };
  earnings: number;
  commissionEnabled: boolean;
}

export interface ArtistApplication {
  id: string;
  name: string;
  email: string;
  portfolioUrl: string;
  statement: string;
  mediums: string[];
  status: 'Pending' | 'Approved' | 'Declined';
  date: string;
}

export interface CommissionRequest {
  id: string;
  artistId: string;
  clientName: string;
  clientEmail: string;
  dimensions: string;
  description: string;
  budget: number;
  status: 'Requested' | 'Accepted' | 'Declined' | 'In_Progress' | 'Completed';
  date: string;
}

export interface Artwork {
  id: string;
  artistId: string; // Foreign key relationship to Artist
  title: string;
  year: string;
  medium: string;
  size: string; // e.g. "48 × 36 inches"
  price: number; // Price of original
  isOriginal: boolean;
  isSold: boolean;
  collectionId: string;
  description: string;
  story: string;
  artistNotes: string;
  image: string; // URL or placeholder vector
  orientation: 'portrait' | 'landscape' | 'square';
  featured: boolean;
  theme: string; // e.g. "Seascape", "Nature", "Abstract"
  limitedEditionSize?: number;
  printsAvailable: boolean;
  printPrice?: number; // Starting price for prints
  locationInspiration?: string;
  moodTags?: string[];
  handwrittenNote?: string;
}

export interface Collection {
  id: string;
  artistId?: string; // Foreign key relationship to Artist
  title: string;
  description: string;
  coverImage: string;
  story: string;
  featured?: boolean;
}

export interface JournalPost {
  id: string;
  artistId?: string; // Foreign key relationship to Artist
  title: string;
  content: string;
  excerpt: string;
  category: 'Studio Diary' | 'Painting Process' | 'Inspiration' | 'Travel' | 'Techniques' | 'Collector Stories';
  readingTime: string;
  date: string;
  image: string;
  tags: string[];
  relatedArtworkIds?: string[];
}

export interface TimelineEvent {
  id: string;
  artistId?: string; // Foreign key relationship to Artist
  year: string;
  title: string;
  description: string;
  iconType: 'brush' | 'award' | 'star' | 'palette' | 'globe';
}

export interface CartItem {
  cartItemId: string; // Unique inside the cart
  artworkId: string;
  title: string;
  image: string;
  optionType: 'original' | 'canvas_print' | 'fine_art_print';
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'Processing' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
  certificateCode?: string; // Signed certificate code
}

export interface User {
  email: string;
  name: string;
  role: 'guest' | 'collector' | 'admin';
}

export interface Testimonial {
  id: string;
  artistId?: string; // Foreign key relationship to Artist
  collectorName: string;
  location: string;
  quote: string;
  artworkTitle: string;
  image: string;
}
