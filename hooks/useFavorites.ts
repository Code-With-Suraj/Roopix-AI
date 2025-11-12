import { useState, useEffect, useCallback } from 'react';
import * as db from '../services/db';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favs = await db.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error("Error fetching favorites from IndexedDB:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (imageUrl: string) => {
    if (favorites.includes(imageUrl)) return;
    
    try {
      setFavorites(prev => [...prev, imageUrl]); // Optimistic update
      await db.addFavorite(imageUrl);
    } catch (error) {
      setFavorites(prev => prev.filter(fav => fav !== imageUrl)); // Revert
      console.error("Error adding favorite to IndexedDB:", error);
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (imageUrl: string) => {
    const originalFavorites = [...favorites];
    try {
      setFavorites(prev => prev.filter(fav => fav !== imageUrl)); // Optimistic update
      await db.removeFavorite(imageUrl);
    } catch (error) {
      setFavorites(originalFavorites); // Revert
      console.error("Error removing favorite from IndexedDB:", error);
    }
  }, [favorites]);

  const isFavorite = useCallback((imageUrl: string) => {
    return favorites.includes(imageUrl);
  }, [favorites]);
  
  return { favorites, addFavorite, removeFavorite, isFavorite, loading };
};