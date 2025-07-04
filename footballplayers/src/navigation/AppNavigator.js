import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ChatBox from "../screens/ChatBox";
import DetailScreen from "../screens/DetailScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarLabel({ routeName, focused }) {
  const labels = {
    Home: "Home",
    Favorites: "Favorites",
    Captains: "Captains",
  };
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {labels[routeName]}
    </Text>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        swipeEnabled: true,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Favorites")
            iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "Robot")
            iconName = focused ? "robot-outline" : "robot-outline";

          return <IconButton icon={iconName} color={color} size={20} />;
        },
        tabBarLabel: ({ focused }) => (
          <TabBarLabel routeName={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: "#00e5ff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: { backgroundColor: "transparent" },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Robot" component={ChatBox} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerTitle: "Player Detail",
            headerStyle: {
              backgroundColor: "#121212",
            },
            headerTitleStyle: {
              color: "#00e5ff",
              fontWeight: "bold",
            },
            headerTintColor: "#00e5ff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1f1f1f",
    borderTopWidth: 0,
    elevation: 6,
    height: Platform.OS === "ios" ? 70 : 60,
    paddingBottom: Platform.OS === "ios" ? 10 : 6,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#bbb",
    marginTop: -8,
  },
  tabLabelFocused: {
    color: "#00e5ff",
    fontWeight: "bold",
  },
});
