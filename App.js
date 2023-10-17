import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./src/Screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/Screens/Auth/LoginScreen";
import RegistrationScreen from "./src/Screens/Auth/RegistrationScreen";
import Index from "./src/Screens/App";
import EventDetails from "./src/Screens/App/EventDetails";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Register" component={RegistrationScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Main" component={Index} options={{headerShown:false}}/>
          <Stack.Screen name="EventDetails" component={EventDetails} options={{headerShown:false}}/>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#652E3E'
  },
});
