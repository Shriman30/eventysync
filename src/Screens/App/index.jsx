import React from "react";
import {Text} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Dashboard from "./Dashboard";
import EventList from "./EventList";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

const Index = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = "#F2E8A2";
          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Events List") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // Return the Ionicons component with the specified icon name, color, and size
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "rgba(11,37,69,0.85)",
        },
        tabBarLabel: ({ color }) => {
          let label;
          color = '#F2E8A2'
          if (route.name === "Dashboard") {
            label = "Dashboard";
          } else if (route.name === "Tasks") {
            label = "Tasks";
          } else if (route.name === "Events List") {
            label = "Events List";
          } else if (route.name === "Profile") {
            label = "Profile";
          }
          return <Text style={{ color }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Events List"
        component={EventList}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default React.memo(Index);

