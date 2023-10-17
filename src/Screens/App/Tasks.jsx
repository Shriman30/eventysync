import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../Components/Header'

const Tasks = () => {
  return (
    <View style={styles.container}>
      <Header title={"Tasks"} />
    </View>
  )
}

export default Tasks

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})