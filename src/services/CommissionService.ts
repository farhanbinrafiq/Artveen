/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommissionRequest } from '../types';
import { INITIAL_COMMISSIONS } from '../data';
import { executeFetch } from './api';

export class CommissionService {
  /**
   * Fetch all registered custom commissions in the ecosystem
   */
  static async getCommissions(): Promise<CommissionRequest[]> {
    const response = await executeFetch<CommissionRequest[]>('/commissions', {
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_commissions');
        return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
      }
    });
    return response.data;
  }

  /**
   * Fetch commissions submitted by a specific patron/collector
   */
  static async getCommissionsByClient(email: string): Promise<CommissionRequest[]> {
    const list = await this.getCommissions();
    return list.filter(c => c.clientEmail === email);
  }

  /**
   * Submit a new bespoke commission solicitation
   */
  static async submitCommission(comm: Omit<CommissionRequest, 'id' | 'status' | 'date'>): Promise<CommissionRequest> {
    const response = await executeFetch<CommissionRequest>('/commissions', {
      method: 'POST',
      body: comm,
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_commissions');
        const list: CommissionRequest[] = saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
        const newComm: CommissionRequest = {
          ...comm,
          id: `COMM-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Requested',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        localStorage.setItem('art_escape_commissions', JSON.stringify([newComm, ...list]));
        return newComm;
      }
    });
    return response.data;
  }

  /**
   * Update status of commission request
   */
  static async updateCommissionStatus(id: string, status: CommissionRequest['status']): Promise<CommissionRequest | null> {
    const response = await executeFetch<CommissionRequest | null>(`/commissions/${id}/status`, {
      method: 'PUT',
      body: { status },
      mockFallback: () => {
        const saved = localStorage.getItem('art_escape_commissions');
        const list: CommissionRequest[] = saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
        const idx = list.findIndex(c => c.id === id);
        if (idx === -1) return null;

        const updated = { ...list[idx], status };
        list[idx] = updated;
        localStorage.setItem('art_escape_commissions', JSON.stringify(list));
        return updated;
      }
    });
    return response.data;
  }
}
