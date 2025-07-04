import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import PlayerCard from "../components/PlayerCard";
import { api } from "../services/api";
import { storage } from "../utils/storage";

const HomeScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const playersData = await api.getPlayers();
      setPlayers(playersData);
      setFilteredPlayers(playersData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadFavorites = async () => {
    const favoritesData = await storage.getFavorites();
    setFavorites(favoritesData);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterPlayers(query, selectedTeam);
  };

  const filterPlayers = (query, team) => {
    let result = players;
    if (query) {
      result = result.filter((p) =>
        p.playerName.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (team && team !== "All") {
      result = result.filter((p) => p.team === team);
    }
    setFilteredPlayers(result);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setDropdownVisible(false);
    filterPlayers(searchQuery, team);
  };

  const handleFavoritePress = async (player) => {
    const isFav = favorites.some((fav) => fav.id === player.id);
    if (isFav) {
      await storage.removeFavorite(player.id);
    } else {
      await storage.addFavorite(player);
    }
    loadFavorites();
  };

  const isFavorite = (playerId) => favorites.some((fav) => fav.id === playerId);

  const teams = ["All", ...new Set(players.map((p) => p.team))];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🏆 Football Explorer</Text>

      <Searchbar
        placeholder="Search player..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
        iconColor="#00e5ff"
        inputStyle={{ color: "white" }}
        placeholderTextColor="#ccc"
      />

      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.dropdownText}>
            {selectedTeam === "All" ? "🌍 All Teams" : `🏳️ ${selectedTeam}`}
          </Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdownList}>
            {teams.map((team) => (
              <TouchableOpacity
                key={team}
                onPress={() => handleTeamSelect(team)}
                style={[
                  styles.dropdownItem,
                  selectedTeam === team && styles.dropdownItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedTeam === team && { color: "#000" },
                  ]}
                >
                  {team}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            onPress={() => navigation.navigate("Detail", { player: item })}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={() => handleFavoritePress(item)}
          />
        )}
        contentContainerStyle={styles.playerList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00e5ff",
    textAlign: "center",
    marginVertical: 20,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    elevation: 5,
  },
  dropdownWrapper: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  dropdownToggle: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    elevation: 3,
  },
  dropdownText: {
    color: "#00e5ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemSelected: {
    backgroundColor: "#00e5ff",
    borderRadius: 8,
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 14,
  },
  playerList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});

export default HomeScreen;
