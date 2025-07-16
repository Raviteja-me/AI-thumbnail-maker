// This file contains client-side only code for interacting with localStorage.

const API_KEY_STORAGE_KEY = 'google-ai-api-key';

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
