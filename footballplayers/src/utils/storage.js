import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const storage = {
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addFavorite: async (player) => {
    try {
      const favorites = await storage.getFavorites();
      if (!favorites.find(fav => fav.id === player.id)) {
        favorites.push(player);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  removeFavorite: async (playerId) => {
    try {
      const favorites = await storage.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== playerId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  clearFavorites: async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }
};
