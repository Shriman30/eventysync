import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/Emblem.png")}
        style={{ width: 50, height: 50 }}
      />
      <Text style={styles.headerTitle}>{title}</Text>
      <Image
        source={require("../../assets/Emblem.png")}
        style={{ width: 50, height: 50 }}
      />
    </View>
  );
};

export default React.memo(Header);


const styles = StyleSheet.create({
  header: {
    marginTop: 0,
    paddingTop: 55,
    paddingBottom: 12,
    flexDirection: "row",
    backgroundColor: "rgba(11,37,69,0.85)",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottomWidth: 0.25,
    borderColor: "#F2E8A2",
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#F2E8A2", // Text color
    fontSize: 28,
    marginBottom: 12,
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 12,
  },
});
