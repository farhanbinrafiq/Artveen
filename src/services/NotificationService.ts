/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export class NotificationService {
  private static listeners: ((notification: SystemNotification) => void)[] = [];

  /**
   * Subscribe to real-time system notification events
   */
  static subscribe(callback: (notification: SystemNotification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Dispatch an ecosystem-wide push toast alert
   */
  static notify(type: NotificationType, title: string, message: string): void {
    const notification: SystemNotification = {
      id: `NOTIF-${Math.floor(10000 + Math.random() * 90000)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };

    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (e) {
        console.error('Error notifying subscriber:', e);
      }
    });

    // Side effect: Log critical issues
    if (type === 'error') {
      console.error(`[Ecosystem Alert] ${title}: ${message}`);
    }
  }

  /**
   * Fetch historical logged notifications for a client session
   */
  static getSessionNotifications(): SystemNotification[] {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('art_escape_notifications');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }

  /**
   * Add to local session notification list
   */
  static saveSessionNotification(notification: SystemNotification): void {
    if (typeof window !== 'undefined') {
      const current = this.getSessionNotifications();
      sessionStorage.setItem('art_escape_notifications', JSON.stringify([notification, ...current]));
    }
  }
}
