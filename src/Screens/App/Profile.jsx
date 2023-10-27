import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { firebaseAuth } from '../../../firebaseConfig';
import { getAuth } from "firebase/auth";
import Header from '../../Components/Header';

const Profile = ({navigation}) => {
  const auth =firebaseAuth;
  const clearEventsCache = async () => {
    try {
      await AsyncStorage.removeItem('cachedEventsData');
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };
  
  const handleSignOut = ()=>{
    auth.signOut()
    clearEventsCache()
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

export default React.memo(Profile);

const styles = StyleSheet.create({

})