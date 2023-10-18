import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

const UpcomingEventsSection = ({ navigation }) => {
  const [events, setEvents] = useState([]);

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
        setEvents(eventData);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []); // Empty dependency array means it will fetch events once when the component mounts

  return (
    <View style={styles.section}>
      <FlatList
        horizontal
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventStatusIndicator}></View>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={{ color: "white" }}>
              Date:{" "}
              {item.date ? format(item.date.toDate(), "yyyy-MM-dd") : "N/A"}
            </Text>
            <Text style={{ color: "white" }}>
              Time: {item.time ? format(item.time.toDate(), "h:mm a") : "N/A"}
            </Text>
            <Text style={{ color: "white" }}>Location: {item.location}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate("EventDetails", { event: item });
                }}
              >
                <Text style={{ textAlign: "center", color: "#F3ECA8" }}>
                  View Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#18694A" }]}
                onPress={() => {
                  // Implement the action for marking the event as completed
                }}
              >
                <Text style={{ textAlign: "center", color: "#F3ECA8" }}>
                  Mark Completed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const primaryColor = "#d9ae94";
const textColor = "#F2E8A2";
const widgetColor = "#753742";

const styles = StyleSheet.create({
  section: {
    // Add any container styles here
    marginTop: 7,
  },
  eventCard: {
    backgroundColor: widgetColor, // Widget background color
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginRight: 12,
    width: 250, // Adjust the card width as needed
    borderColor: primaryColor, // Border color for Glassmorphism effect
    borderWidth: 1, // Border width for Glassmorphism effect
    shadowColor: textColor, // Neomorphism shadow color
    shadowOpacity: 1, // Neomorphism shadow opacity
    shadowOffset: 20,
    shadowRadius: 1,
  },
  // This will change dynamically based on if it is ongoing or upcoming
  eventStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
    position: "absolute",
    top: 10,
    right: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: textColor, // Text color
  },
  actionButtons: {
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#800000", // Primary color for the buttons
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "48%", // Adjust as needed,
    shadowColor: textColor,
    shadowRadius: 1,
    shadowOpacity: 0.5,
    shadowOffset: 20,
  },
});

export default UpcomingEventsSection;
