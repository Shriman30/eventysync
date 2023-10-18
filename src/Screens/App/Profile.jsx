import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { firebaseAuth } from '../../../firebaseConfig';
import { getAuth } from "firebase/auth";
import Header from '../../Components/Header';

const Profile = ({navigation}) => {
  const auth =firebaseAuth;
  
  const handleSignOut = ()=>{
    auth.signOut()
      navigation.replace("Welcome");
  }
  return (
    <View style={styles.container}>
      <Header title={"Profile"}/>
      <Text>Profile</Text>
      <Button title='logout' onPress={handleSignOut}/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({

})