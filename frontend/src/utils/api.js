// src/utils/api.js
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function useAuthHeaders() {
  const { token } = useAuth();
  return useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);
}

export async function getJSON(url, headers) {
  const res = await fetch(url, { headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export async function postJSON(url, headers, body) {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export async function putJSON(url, headers, body) {
  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}