const API_KEY_STORAGE_KEY = 'google-ai-api-key';

// This is a server-side "action" but in this context, we acknowledge
// it will be called from client components. We use a library-level
// implementation that is isomorphic (works on client/server).
// For this app, it will only ever be called on the client.

// We need a client-side mechanism to get/set the key.
// These functions will only work in a browser context.
export const getApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return null;
};

export const setApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(API_KEY_STORAGE_KEY, key);
  }
};
