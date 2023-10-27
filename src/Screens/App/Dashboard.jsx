import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Header from "../../Components/Header";
import EventsSection from "../../Components/UpcomingEvents";

const Dashboard = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const goToAllEvents = () => {
    navigation.navigate("Events List");
  };

  // Function to fetch upcoming events from Firebase
  const fetchUpcomingEvents = async () => {
    try {
      const firestore = getFirestore();
      const eventsCollection = collection(firestore, "Events");
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Construct a Firestore query to get upcoming events for the current user
        const q = query(
          eventsCollection,
          where("status", "==", "upcoming"), // Adjust the status filter
          where("createdBy", "==", user.uid)
        );

        const eventSnapshot = await getDocs(q);

        const eventData = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUpcomingEvents(eventData);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  }

    // Function to fetch upcoming events from Firebase
    const fetchOngoingEvents = async () => {
      try {
        const firestore = getFirestore();
        const eventsCollection = collection(firestore, "Events");
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (user) {
          // Construct a Firestore query to get upcoming events for the current user
          const q = query(
            eventsCollection,
            where("status", "==", "ongoing"), // Adjust the status filter
            where("createdBy", "==", user.uid)
          );
  
          const eventSnapshot = await getDocs(q);
  
          const eventData = eventSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOngoingEvents(eventData);
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header title={"Dashboard"} />
      <ScrollView style={styles.scrollableSection}>
        {/* Upcoming Events */}
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
          <Text style={styles.sectionText}> You have {upcomingEvents.length.toString()} Upcoming events </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={goToAllEvents}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* Upcoming Events Section */}
          <EventsSection
            navigation={navigation}
            events={upcomingEvents}
            fetchEvents={fetchUpcomingEvents}
          />
        </View>

        <Text style={styles.sectionHeader}>Ongoing Events</Text>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}> You have {ongoingEvents.length.toString()} ongoing events </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={goToAllEvents}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* Ongoing Events Section */}
          <EventsSection
            navigation={navigation}
            events={ongoingEvents}
            fetchEvents={fetchOngoingEvents}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

const primaryColor = "rgba(11,37,69,0.90)";
const textColor = "#F2E8A2";
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
    color: textColor,
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

export default React.memo(Dashboard);
