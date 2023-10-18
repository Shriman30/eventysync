import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getFirestore, collection, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Header from "../../Components/Header";
import UpcomingEventsSection from "../../Components/UpcomingEvents";

const Dashboard = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);

  const goToAllEvents = () => {
    navigation.navigate("Events");
  };

  // Function to fetch upcoming events from Firebase
  const fetchUpcomingEvents = async () => {
    const firestore = getFirestore();
    const eventsCollection = collection(firestore, "Events");
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Construct a Firestore query for upcoming events created by the user
      const query = collection(
        eventsCollection,
        where("status", "==", "upcoming"),
        where("createdBy", "==", user.uid)
      );

      const eventSnapshot = await getDocs(query);

        // Add a console log to check the retrieved data
    console.log("Upcoming events data:", eventSnapshot.docs);

      // Map the data from Firebase to an array of event objects
      const eventData = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventData);
      setUpcomingEventsCount(eventData.length);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header title={"Dashboard"} />
      <ScrollView style={styles.scrollableSection}>
        {/* Upcoming Events */}
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              You have {upcomingEventsCount} events coming up this week.
            </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={goToAllEvents}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* Upcoming Events Section */}
          <UpcomingEventsSection
            navigation={navigation}
            events={events}
            fetchUpcomingEvents={fetchUpcomingEvents}
          />
        </View>
        {/* Current Tasks */}
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
