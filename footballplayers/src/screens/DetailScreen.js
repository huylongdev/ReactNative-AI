import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { Card, IconButton, Divider } from "react-native-paper";
import { storage } from "../utils/storage";
import FeedbackList from "../components/FeedbackList";
import { api } from "../services/api";

const DetailScreen = ({ route, navigation }) => {
  const { player: playerFromRoute, showFavorite } = route.params;
  const [player] = useState(playerFromRoute);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      const favoritesData = await storage.getFavorites();
      if (favoritesData.some((fav) => fav.id === player.id)) {
        setIsFavorite(true);
      }
    };
    loadFavorites();
  }, [player.id]);

  const handleFavoritePress = async () => {
    const newFavoriteStatus = !isFavorite;
    if (newFavoriteStatus) {
      await storage.addFavorite(player);
    } else {
      await storage.removeFavorite(player.id);
    }
    setIsFavorite(newFavoriteStatus);
  };

  const minutesToHours = (minutes) => {
    if (!minutes) return "0h";
    return (minutes / 60).toFixed(1);
  };

  const calculateAverageRating = () => {
    if (!player || !player.feedbacks || player.feedbacks.length === 0)
      return "0.0";
    const sum = player.feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    return (sum / player.feedbacks.length).toFixed(1);
  };

  if (!player) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00e5ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.topHeader}>
          <Image source={{ uri: player.image }} style={styles.image} />
          <View style={styles.infoSection}>
            <Text style={styles.name}>{player.playerName}</Text>
            <Text style={styles.team}>{player.team}</Text>
            {player.isCaptain && (
              <Text style={styles.captain}>⭐ Team Captain</Text>
            )}
          </View>
          {showFavorite && (
            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              size={28}
              onPress={handleFavoritePress}
              iconColor={isFavorite ? "#ff4081" : "#aaa"}
              style={styles.favoriteIcon}
            />
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {new Date().getFullYear() - player.YoB}
            </Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{player.MinutesPlayed}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {(player.PassingAccuracy * 1).toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Passing</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Position</Text>
          <Text style={styles.sectionText}>{player.position}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Performance</Text>
          <View style={styles.performanceRow}>
            <View style={styles.performanceBox}>
              <Text style={styles.sectionText}>Minutes/Game</Text>
              <Text style={styles.performanceValue}>
                {minutesToHours(player.MinutesPlayed / 10)}h
              </Text>
            </View>
            <View style={styles.performanceBox}>
              <Text style={styles.sectionText}>Passing Acc.</Text>
              <Text style={styles.performanceValue}>
                {(player.PassingAccuracy * 1).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Ratings & Feedback</Text>
          <FeedbackList feedbacks={player.feedbacks || []} />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  card: {
    backgroundColor: "#1f1f1f",
    margin: 16,
    borderRadius: 16,
    elevation: 5,
    paddingBottom: 16,
  },
  topHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#00e5ff",
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00e5ff",
  },
  team: {
    fontSize: 16,
    color: "#bbb",
    marginVertical: 4,
  },
  captain: {
    fontSize: 14,
    color: "#ffd700",
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  divider: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00e5ff",
  },
  statLabel: {
    fontSize: 14,
    color: "#bbb",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#00e5ff",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#ccc",
  },
  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  performanceBox: {
    flex: 1,
    alignItems: "center",
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00e5ff",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetailScreen;
