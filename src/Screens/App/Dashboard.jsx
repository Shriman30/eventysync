import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../../Components/Header";
import UpcomingEventsSection from "../../Components/UpcomingEvents";

const primaryColor = "rgba(11,37,69,0.90)";
const textColor = "#F2E8A2";

const Dashboard = ({ navigation }) => {
  const goToAllEvents = () => {
    navigation.navigate("Events");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header title={"Dashboard"}/>
      <ScrollView style={styles.scrollableSection}>
        {/* Upcoming Events */}
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              You have 7 events coming up this week.
            </Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={goToAllEvents}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* Upcoming Events Sectoin */}
          <UpcomingEventsSection navigation={navigation} />
        </View>
        {/* Current Tasks */}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: primaryColor,
  },
  section: {
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowOpacity: 0.25,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: textColor, // Text color
  },
  sectionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionText: {
    fontWeight: "500",
    fontStyle: "italic",
    marginTop: 3,
    color: textColor,
  },
  viewAllButton: {
    marginHorizontal: 12,
  },
  viewAllText: {
    fontWeight: "800",
    fontSize: 16,
    color: textColor,
  },
});

export default Dashboard;
