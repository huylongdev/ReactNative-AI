import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

const PlayerCard = ({ player, onPress, isFavorite, onFavoritePress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: player.image }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{player.playerName}</Text>
        <Text style={styles.detail}>Position: {player.position}</Text>
        <Text style={styles.detail}>
          Minutes: {(player.MinutesPlayed / 60).toFixed(1)} hrs
        </Text>
        <Text style={styles.detail}>
          Captain: {player.isCaptain ? "✅" : "❌"}
        </Text>
      </View>

      <IconButton
        icon={isFavorite ? "heart" : "heart-outline"}
        iconColor={isFavorite ? "#ff4081" : "#aaa"}
        size={24}
        onPress={onFavoritePress}
        style={styles.favorite}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 14,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    position: "relative",
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#00e5ff",
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  detail: {
    fontSize: 13,
    color: "#ccc",
  },
  favorite: {
    position: "absolute",
    right: 6,
    top: 6,
  },
});

export default PlayerCard;
