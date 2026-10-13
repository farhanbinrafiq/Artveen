/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, CartItem } from '../types';
import { executeFetch } from './api';

export class CollectorService {
  /**
   * Fetch all registered orders (Acquisition Registry)
   */
  static async getOrders(): Promise<Order[]> {
    const response = await executeFetch<Order[]>('/orders', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_orders');
        return saved ? JSON.parse(saved) : [];
      }
    });
    return response.data;
  }

  /**
   * Fetch orders for a specific collector account
   */
  static async getOrdersByEmail(email: string): Promise<Order[]> {
    const list = await this.getOrders();
    return list.filter(o => o.customerEmail === email);
  }

  /**
   * Submit a new acquisition order (Checkout context)
   */
  static async submitOrder(orderData: {
    customerName: string;
    customerEmail: string;
    items: CartItem[];
    total: number;
    shippingAddress: Order['shippingAddress'];
  }): Promise<Order> {
    const response = await executeFetch<Order>('/orders', {
      method: 'POST',
      body: orderData,
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_orders');
        const list: Order[] = saved ? JSON.parse(saved) : [];
        
        const certCode = `COA-AE-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: Order = {
          ...orderData,
          id: `AE-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          status: 'Processing',
          certificateCode: certCode
        };

        // Also update local artworks sold state
        const currentArt = localStorage.getItem('art_escape_artworks');
        if (currentArt) {
          const artList = JSON.parse(currentArt);
          orderData.items.forEach(item => {
            if (item.optionType === 'original') {
              const artIdx = artList.findIndex((a: any) => a.id === item.artworkId);
              if (artIdx > -1) {
                artList[artIdx].isSold = true;
              }
            }
          });
          localStorage.setItem('art_escape_artworks', JSON.stringify(artList));
        }

        localStorage.setItem('art_escape_orders', JSON.stringify([newOrder, ...list]));
        return newOrder;
      }
    });
    return response.data;
  }

  /**
   * Update status of an order (Admin context)
   */
  static async updateOrderStatus(id: string, status: Order['status'], trackingNumber?: string): Promise<Order | null> {
    const response = await executeFetch<Order | null>(`/orders/${id}/status`, {
      method: 'PUT',
      body: { status, trackingNumber },
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_orders');
        const list: Order[] = saved ? JSON.parse(saved) : [];
        const idx = list.findIndex(o => o.id === id);
        if (idx === -1) return null;

        const updated = { 
          ...list[idx], 
          status, 
          trackingNumber: trackingNumber || list[idx].trackingNumber 
        };
        list[idx] = updated;
        localStorage.setItem('art_escape_orders', JSON.stringify(list));
        return updated;
      }
    });
    return response.data;
  }

  /**
   * Fetch current wishlist for a client email
   */
  static async getWishlist(email: string): Promise<string[]> {
    const response = await executeFetch<string[]>(`/wishlist/${email}`, {
      mockFallback: () => {
        const saved = localStorage.getItem(`art_escape_wishlist_${email}`);
        return saved ? JSON.parse(saved) : [];
      }
    });
    return response.data;
  }

  /**
   * Toggle an item in collector's wishlist
   */
  static async toggleWishlist(email: string, artworkId: string): Promise<string[]> {
    const response = await executeFetch<string[]>(`/wishlist/${email}/toggle`, {
      method: 'POST',
      body: { artworkId },
      mockFallback: () => {
        const saved = localStorage.getItem(`art_escape_wishlist_${email}`);
        let list: string[] = saved ? JSON.parse(saved) : [];
        if (list.includes(artworkId)) {
          list = list.filter(id => id !== artworkId);
        } else {
          list.push(artworkId);
        }
        localStorage.setItem(`art_escape_wishlist_${email}`, JSON.stringify(list));
        return list;
      }
    });
    return response.data;
  }
}
