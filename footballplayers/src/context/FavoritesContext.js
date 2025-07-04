import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    storage.getFavorites().then(setFavorites);
  }, []);

  const addFavorite = async (player) => {
    const newFavorites = [...favorites, player];
    setFavorites(newFavorites);
    await storage.addFavorite(player);
  };

  const removeFavorite = async (playerId) => {
    const newFavorites = favorites.filter((fav) => fav.id !== playerId);
    setFavorites(newFavorites);
    await storage.removeFavorite(playerId);
  };

  const isFavorite = (playerId) => {
    return favorites.some((fav) => fav.id === playerId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext); 