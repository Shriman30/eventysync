import React, { useState } from "react";
import {StyleSheet,Text,View,TextInput,TouchableOpacity,Image} from "react-native";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {firebaseAuth} from '../../../firebaseConfig'
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = firebaseAuth;

  const handleRegistration = async () => {
   if(!email ||!password){
    alert('Please enter all fields');
    return;
   }
    try{
      const authResult = await createUserWithEmailAndPassword(auth,email,password);
      // Get the user's UID from the authentication result
      const userUID = authResult.user.uid;

      // Creating a firestore reference to the user's document
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users',userUID);
      // set user data in firestore
      await setDoc(userDocRef, {
        email: email,
        userId: userUID,
        password:password
        // Add other user-related fields as needed
      });
      navigation.navigate("Main");
    }
    catch(error){
      alert('Registration failed: '+ error.message);
      console.log(error)
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
        <TouchableOpacity onPress={handleRegistration}>
          <Text
            style={{ textAlign: "center", fontWeight: "500", fontSize: 18 }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(RegistrationScreen);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "space-evenly",
    height: "100%",
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
