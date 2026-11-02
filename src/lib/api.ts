import { authClient } from './auth-client';

const rawServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
const SERVER_URL = rawServerUrl.replace(/\/+$/, '');

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let token = typeof window !== 'undefined' ? localStorage.getItem('boighuri_jwt_token') : null;

  // Auto-sync token if missing from localStorage but active BetterAuth session exists
  if (!token && typeof window !== 'undefined') {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user?.email) {
        const syncRes = await syncJwtToken({
          email: session.data.user.email,
          name: session.data.user.name || undefined,
          image: session.data.user.image || undefined,
        });
        if (syncRes?.token) {
          token = syncRes.token;
        }
      }
    } catch (e) {
      console.warn('Auto-sync token in fetchWithAuth caught:', e);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${SERVER_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If 401 Unauthorized occurs, token might be expired or invalidated. Attempt single auto-refresh and retry.
  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user?.email) {
        const syncRes = await syncJwtToken({
          email: session.data.user.email,
          name: session.data.user.name || undefined,
          image: session.data.user.image || undefined,
        });
        if (syncRes?.token) {
          headers['Authorization'] = `Bearer ${syncRes.token}`;
          const retryRes = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
          const retryData = await retryRes.json().catch(() => ({}));
          if (!retryRes.ok) {
            throw new Error(retryData.message || 'রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে');
          }
          return retryData;
        }
      }
    } catch {
      // Continue to original response handling
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে');
  }

  return data;
}

export async function syncJwtToken(user: { email: string; name?: string; image?: string }) {
  try {
    const res = await fetch(`${SERVER_URL}/auth/jwt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'include',
    });
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('boighuri_jwt_token', data.token);
    }
    return data;
  } catch (error) {
    console.error('Failed to sync JWT token with server:', error);
  }
}

export function clearJwtToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('boighuri_jwt_token');
  }
}
