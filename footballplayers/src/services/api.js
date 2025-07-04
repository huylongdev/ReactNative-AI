import axios from "axios";

const BASE_URL = "https://6844373e71eb5d1be032b539.mockapi.io";

export const api = {
  getPlayers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/players`);
      return response.data;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  },

  getPlayerById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/players/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching player:", error);
      throw error;
    }
  },

  getTeams: async () => {
    const teams = [...new Set(data.players.map((p) => p.team))];
    return teams;
  },
};
