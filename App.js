import React, {useState, useEffect} from "react";
import { ActivityIndicator, StyleSheet, View, LogBox } from "react-native";
import WelcomeScreen from "./src/Screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import LoginScreen from "./src/Screens/Auth/LoginScreen";
import RegistrationScreen from "./src/Screens/Auth/RegistrationScreen";
import Index from "./src/Screens/App";
import EventDetails from "./src/Screens/App/EventDetails";

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(); // to ignore all warnings

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F2E8A2"/>
        </View>
      ) : (
        <Stack.Navigator initialRouteName={user ? "Main" : "Welcome"}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false, gestureDirection:'horizontal', gestureEnabled:'false'}} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Index} options={{ headerShown: false, gestureDirection:'horizontal', gestureEnabled:'false' }} />
          <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(11,37,69,0.90)",
    justifyContent: "center",
    alignItems: "center",
  },
});