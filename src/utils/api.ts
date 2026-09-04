/**
 * Resolves API endpoints for web and packaged Android builds.
 *
 * Web development: leave VITE_API_BASE_URL empty to use the same-origin Express server.
 * Android/production: set VITE_API_BASE_URL to the HTTPS URL of the deployed RoldyGoldy API.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
const API_BASE_URL = rawBase.replace(/\/$/, '');

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
  isConfigured: Boolean(API_BASE_URL),
};
