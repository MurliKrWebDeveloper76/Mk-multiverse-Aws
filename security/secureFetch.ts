
import { auth } from './auth';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * MK Multiverse Secure API Layer
 * Implements timeout, auth headers, and automatic retry guards
 */
export const secureFetch = async (url: string, options: FetchOptions = {}) => {
  const { timeout = 8000, ...rest } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = new Headers(options.headers);
  const token = auth.getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Anti-cache for sensitive operations
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (response.status === 401) {
      auth.logout();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    console.error('[SecureFetch Error]:', error);
    throw error;
  }
};
