'use client';

import { useCallback, useEffect, useState } from 'react';

export interface WishlistItem {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  image: string;
  savedAt: number;
}

const DEFAULT_USER_ID = 'digitalmongers72@gmail.com';

function buildStorageKey(userId: string): string {
  const sanitized = userId.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  return `virelle_favorites_${sanitized || 'guest'}`;
}

function readFromStorage(storageKey: string): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useWishlist(userId: string = DEFAULT_USER_ID) {
  const storageKey = buildStorageKey(userId);
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);

  // Populate after mount and sync across browser tabs
  useEffect(() => {
    setFavorites(readFromStorage(storageKey));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setFavorites(readFromStorage(storageKey));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);

  const persist = useCallback(
    (next: WishlistItem[]) => {
      setFavorites(next);
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore storage quota / private-browsing errors
      }
    },
    [storageKey]
  );

  const isSaved = useCallback(
    (itemId: string) => favorites.some((entry) => entry.id === itemId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: Omit<WishlistItem, 'savedAt'>) => {
      const exists = favorites.some((entry) => entry.id === item.id);
      if (exists) {
        persist(favorites.filter((entry) => entry.id !== item.id));
        return false;
      }
      persist([{ ...item, savedAt: Date.now() }, ...favorites]);
      return true;
    },
    [favorites, persist]
  );

  const removeFavorite = useCallback(
    (itemId: string) => {
      persist(favorites.filter((entry) => entry.id !== itemId));
    },
    [favorites, persist]
  );

  return {
    favorites,
    count: favorites.length,
    isSaved,
    toggleFavorite,
    removeFavorite,
  };
}
