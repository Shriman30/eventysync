import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LoadingScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (user) {
        // User is authenticated, navigate to the main screen
        navigation.navigate("Main");
      } else {
        // User is not authenticated, navigate to the welcome screen
        navigation.navigate("Welcome");
      }
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F2E8A2" />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(11,37,69,0.90)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default LoadingScreen;
