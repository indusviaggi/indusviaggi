// Centralized fetch wrapper to inject access token into all API requests
// Usage: import apiFetch from '@/utils/apiFetch';

export default async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  // Retrieve the access token from localStorage or another secure place
  const token = localStorage.getItem('indusviaggi_token');

  // Clone headers or create new
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Use the same input and init, but with injected headers
  return fetch(input, {
    ...init,
    headers,
  });
}
