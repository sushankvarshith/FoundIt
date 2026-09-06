/**
 * FoundIt REST API Client
 * Facilitates communication between the React Frontend and the Core Java REST Backend.
 * Includes graceful timeout handling and automatic fallback.
 */

export const API_BASE = 'http://localhost:8080/api';

export interface BackendHealth {
  online: boolean;
  service?: string;
  javaVersion?: string;
  mysqlConnected?: boolean;
  storageMode?: string;
  itemsCount?: number;
}

export const apiClient = {
  /**
   * Check connection to the Java backend on port 8080
   */
  async checkHealth(): Promise<BackendHealth> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${API_BASE}/health`, {
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
        };
      }
    } catch {
      // Backend not running or timeout
    }
    return {
      online: false,
      storageMode: 'Offline / Browser LocalStorage Mode',
    };
  },

  /**
   * Perform a GET request to the Java backend
   */
  async get<T>(endpoint: string): Promise<T | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
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
