const rawServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
const SERVER_URL = rawServerUrl.replace(/\/+$/, '');

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('boighuri_jwt_token') : null;

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
