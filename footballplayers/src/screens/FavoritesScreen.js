import React, { useState, useEffect } from "react";

import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  Animated,
} from "react-native";
import {
  Searchbar,
  IconButton,
  Text,
  Checkbox,
  Button,
} from "react-native-paper";
import PlayerCard from "../components/PlayerCard";
import { storage } from "../utils/storage";
import { useIsFocused } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const loadFavorites = async () => {
    const favoritesData = await storage.getFavorites();
    setFavorites(favoritesData);
    setFilteredFavorites(favoritesData);
    setSelected([]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = favorites.filter((player) =>
      player.playerName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFavorites(filtered);
    setSelected([]);
  };

  const confirmDelete = (playerId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this player from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleRemoveFavorite(playerId),
        },
      ]
    );
  };

  const handleRemoveFavorite = async (playerId) => {
    await storage.removeFavorite(playerId);
    await loadFavorites();
  };

  const handleClearAll = async () => {
    Alert.alert("Confirm Delete All", "Remove all favorite players?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete All",
        style: "destructive",
        onPress: async () => {
          await storage.clearFavorites();
          setFavorites([]);
          setFilteredFavorites([]);
        },
      },
    ]);
  };

  const handleSelect = (playerId) => {
    setSelected((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleRemoveSelected = async () => {
    let favs = await storage.getFavorites();
    favs = favs.filter((player) => !selected.includes(player.id));
    await storage.clearFavorites();
    for (const player of favs) {
      await storage.addFavorite(player);
    }
    await loadFavorites();
  };

  const renderRightActions = (playerId) => (
    <View style={styles.deleteAction}>
      <IconButton
        icon="trash-can"
        color="#fff"
        size={26}
        onPress={() => confirmDelete(playerId)}
      />
    </View>
  );

  const renderItem = ({ item }) =>
    multiSelectMode ? (
      <View style={styles.row}>
        <Checkbox
          status={selected.includes(item.id) ? "checked" : "unchecked"}
          onPress={() => handleSelect(item.id)}
        />
        <View style={{ flex: 1 }}>
          <PlayerCard
            player={item}
            onPress={() =>
              navigation.navigate("Detail", {
                player: item,
                showFavorite: true,
              })
            }
            isFavorite={true}
            onFavoritePress={() => handleRemoveFavorite(item.id)}
          />
        </View>
      </View>
    ) : (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        renderLeftActions={() => renderRightActions(item.id)} //
      >
        <PlayerCard
          player={item}
          onPress={() =>
            navigation.navigate("Detail", { player: item, showFavorite: true })
          }
          isFavorite={true}
          onFavoritePress={() => handleRemoveFavorite(item.id)}
        />
      </Swipeable>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search favorites"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ color: "white" }}
          placeholderTextColor="#999"
          iconColor="#00e5ff"
        />
        <IconButton
          icon={multiSelectMode ? "close" : "playlist-check"}
          size={24}
          onPress={() => {
            setMultiSelectMode(!multiSelectMode);
            setSelected([]);
          }}
          style={styles.clearButton}
          iconColor="#00e5ff"
        />
        {favorites.length > 0 && multiSelectMode && (
          <IconButton
            icon="delete-sweep-outline"
            size={24}
            onPress={() => {
              if (selected.length === 0) {
                const allIds = filteredFavorites.map((p) => p.id);
                setSelected(allIds);
              } else {
                Alert.alert(
                  "Confirm Delete Selected",
                  `Delete ${selected.length} selected favorite(s)?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: handleRemoveSelected,
                    },
                  ]
                );
              }
            }}
            style={styles.clearButton}
            iconColor="#ff5252"
          />
        )}
      </View>

      {multiSelectMode && selected.length > 0 && (
        <Button
          mode="contained"
          onPress={handleRemoveSelected}
          style={styles.deleteSelectedBtn}
          icon="delete"
          buttonColor="#ff5252"
        >
          Delete selected ({selected.length})
        </Button>
      )}

      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No matching favorites found"
              : "No favorite players yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1f1f1f",
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#2b2b2b",
    borderRadius: 20,
  },
  clearButton: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 4,
  },
  deleteSelectedBtn: {
    margin: 10,
    borderRadius: 10,
  },
  deleteAction: {
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "90%",
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default FavoritesScreen;
