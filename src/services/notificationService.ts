import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { AppNotification } from '../types';

const STORAGE_KEY = 'foundit_notifications';

export const notificationService = {
  getNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_NOTIFICATIONS;
  },

  markAsRead(id: string): AppNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },

  markAllAsRead(): AppNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },

  getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const list = this.getNotifications();
    const created: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      timestamp: 'Just now',
    };
    const updated = [created, ...list];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return created;
  }
};
