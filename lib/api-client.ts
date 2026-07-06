/**
 * API Client for PandaMandarin
 *
 * In Next.js dev mode: uses relative URLs -> local API routes work.
 * In Capacitor app / static export: uses absolute Vercel backend URL.
 */

const PRODUCTION_API_BASE = 'https://untitled-movi0quik7oy.vercel.app';

function isLocalDevHost(hostname: string): boolean {
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
}

function shouldUseProductionApi(): boolean {
  if (typeof window === 'undefined') return false;

  const { protocol, hostname } = window.location;
  if (isLocalDevHost(hostname)) return false;

  return protocol.includes('capacitor') ||
         protocol.includes('pandamandarin') ||
         protocol === 'file:';
}

export function apiUrl(path: string): string {
  const url = shouldUseProductionApi() ? `${PRODUCTION_API_BASE}${path}` : path;

  if (typeof window !== 'undefined') {
    console.info('[API] apiUrl', JSON.stringify({
      path,
      url,
      origin: window.location.origin,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      production: url.startsWith(PRODUCTION_API_BASE),
    }));
  }

  return url; // relative URL -> works in Next.js dev/live reload
}

export async function apiFetch(path: string, options?: RequestInit) {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res.json();
}
