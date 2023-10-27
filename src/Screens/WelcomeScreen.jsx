import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import firebaseAuth from "../../firebaseConfig";
import { getAuth} from "firebase/auth";

const WelcomeScreen = ({ navigation }) => {
  const auth = getAuth(firebaseAuth)
  const onSignInPress = () => {
    navigation.navigate("Login");
  };
  const onRegisterPress = () => {
    navigation.navigate("Register");
  };


  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      <View style={{ paddingTop: 32 }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={onSignInPress}>
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 24,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ width: 124 }} onPress={onRegisterPress}>
            <Text
              style={{
                color: "#F2E8A2",
                fontWeight: "bold",
                fontSize: 24,
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default React.memo(WelcomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'rgba(11,37,69,1)'
  },
  logo: {
    height: 230,
    width: 350,
  },
  buttonContainer: {
    paddingVertical: 8,
  },
  signInButton: {
    backgroundColor: "#F2E8A2",
    height: 48,
    width: 124,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
  },
});
