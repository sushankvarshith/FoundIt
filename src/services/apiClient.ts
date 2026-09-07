/**
 * FoundIt REST API Client
 * Facilitates communication between the React Frontend and the Core Java REST Backend.
 * Includes graceful timeout handling and automatic fallback.
 */

const STORAGE_API_URL_KEY = 'foundit_custom_api_url';

export const getCustomApiUrl = (): string => {
  try {
    return localStorage.getItem(STORAGE_API_URL_KEY) || '';
  } catch {
    return '';
  }
};

export const setCustomApiUrl = (url: string): void => {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_API_URL_KEY);
    } else {
      localStorage.setItem(STORAGE_API_URL_KEY, url.trim());
    }
  } catch {
    // ignore
  }
};

export const resolveApiBase = (): string => {
  const custom = getCustomApiUrl();
  const envUrl = custom || (import.meta.env.VITE_API_URL as string)?.trim();
  if (!envUrl) return 'http://localhost:8080/api';

  const trimmed = envUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE = resolveApiBase();

export interface BackendHealth {
  online: boolean;
  service?: string;
  javaVersion?: string;
  mysqlConnected?: boolean;
  storageMode?: string;
  itemsCount?: number;
  usersCount?: number;
  resolvedApiUrl?: string;
}

export const apiClient = {
  getApiBase: resolveApiBase,
  getCustomApiUrl,
  setCustomApiUrl,

  /**
   * Check connection to the Java backend
   */
  async checkHealth(): Promise<BackendHealth> {
    const base = resolveApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${base}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          service: data.service,
          javaVersion: data.javaVersion,
          mysqlConnected: data.mysqlConnected,
          storageMode: data.storageMode,
          itemsCount: data.itemsCount,
          usersCount: data.usersCount,
          resolvedApiUrl: base,
        };
      }
    } catch {
      // Backend not running or timeout
    }
    return {
      online: false,
      storageMode: 'Offline / Browser LocalStorage Mode',
      resolvedApiUrl: base,
    };
  },

  /**
   * Perform a GET request to the Java backend
   */
  async get<T>(endpoint: string): Promise<T | null> {
    const base = resolveApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${base}${endpoint}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend unavailable, return null to trigger local fallback
    }
    return null;
  },

  /**
   * Perform a POST request to the Java backend
   */
  async post<T>(endpoint: string, body: any): Promise<T | null> {
    const base = resolveApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend unavailable
    }
    return null;
  },

  /**
   * Perform a PUT request to the Java backend
   */
  async put<T>(endpoint: string, body: any): Promise<T | null> {
    const base = resolveApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`${base}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend unavailable
    }
    return null;
  },

  /**
   * Perform a DELETE request to the Java backend
   */
  async delete<T>(endpoint: string): Promise<T | null> {
    const base = resolveApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`${base}${endpoint}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend unavailable
    }
    return null;
  },
};
