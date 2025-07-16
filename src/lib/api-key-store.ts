'use server';
import { cookies } from 'next/headers'

const API_KEY_STORAGE_KEY = 'google-ai-api-key';

// This is a server-side "action" but in this context, we acknowledge
// it will be called from client components. We use a library-level
// implementation that is isomorphic (works on client/server).
// For this app, it will only ever be called on the client.

// We need a client-side mechanism to get/set the key.
// These functions will only work in a browser context.
export const getApiKey = async (): Promise<string | null> => {
  return cookies().get(API_KEY_STORAGE_KEY)?.value || null
};

export const setApiKey = async (key: string): Promise<void> => {
  cookies().set(API_KEY_STORAGE_KEY, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};