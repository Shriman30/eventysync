import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { firebaseAuth } from '../../../firebaseConfig';
import { getAuth } from "firebase/auth";

const Profile = ({navigation}) => {
  const auth =firebaseAuth;
  
  const handleSignOut = ()=>{
    auth.signOut().then(()=>{
      navigation.replace("Login");
    })

  }
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title='logout' onPress={handleSignOut}/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container:{
    marginTop:24,
    padding:12,
  }
})