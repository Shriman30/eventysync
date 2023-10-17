import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import firebaseAuth from "../../../firebaseConfig";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(firebaseAuth);

  const handleLogin = async () => {
    try{
      const response = await signInWithEmailAndPassword(auth,email,password);
      navigation.navigate("Main")
    }
    catch(error){
      console.log(error.message)
    }
    finally{
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View style={[styles.container]}>
      <Image
        source={require("../../../assets/logo.png")}
        style={{ width: 350, height: 200, alignSelf: "center" }}
      />
      <View style={styles.inputContainer}>
        {/*Email input */}
        <View style={{ paddingTop: 12 }}>
          <Text style={{ paddingBottom: 4, color: "#F3ECA8" }}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            onChangeText={setEmail}
            placeholderTextColor={"#ABA778"}
          />
        </View>

        {/*Password input */}
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ paddingBottom: 4, color: "#F3ECA8" }}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholderTextColor={"#ABA778"}
          />
        </View>
      </View>

      {/* Button Area */}
      <View style={styles.loginButton}>
        <TouchableOpacity onPress={handleLogin}>
          <Text
            style={{ textAlign: "center", fontWeight: "500", fontSize: 18 }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "space-evenly",
    height: "100%",
    // backgroundColor:'#652E3E'
    backgroundColor: "rgba(11,37,69,1)",
  },
  inputContainer: {
    gap: 32,
  },
  input: {
    borderWidth: 1,
    height: 42,
    borderRadius: 8,
    paddingLeft: 12,
    borderColor: "#F3ECA8",
    color: "#F3ECA8",
  },
  loginButton: {
    paddingVertical: 7,
    backgroundColor: "#F3ECA8",
    width: 100,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#F3ECA8",
  },
});
