import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import Header from "../../Components/Header";
import FilterButton from "../../Components/FilterButton";
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "react-native-elements/dist/buttons/Button";
import { format } from 'date-fns';
import CreateEvent from "../../Components/CreateEvent";

const EventList = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // Filter options: 'all', 'upcoming', 'ongoing', 'completed'
  const [events, setEvents] = useState([]);

  // states to manage event creation and modal:
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCreated, setEventCreated] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Create a new event object
      // TODO: the status should change based on the date inputted by the usertr
      const newEvent = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        createdBy: user.uid,
        status: "upcoming", // Set status to "upcoming" as an example
      };

      const firestore = getFirestore();
      const eventsCollection = collection(firestore, "Events");

      // Add the new event to Firestore
      await addDoc(eventsCollection, newEvent);
      toggleModal(); // Close the modal

      setEventCreated(true);

      setEventName("");
      setEventDate("");
      setEventTime("");
      setEventLocation("");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Function to fetch events from Firebase based on status and the authenticated user
  const fetchEventsByFilter = async () => {
    const firestore = getFirestore();
    const eventsCollection = collection(firestore, "Events");
    // Get the currently authenticated user
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Construct a Firestore query based on the status filter and user's UID
      let q;
      if (selectedFilter === "all") {
        q = query(eventsCollection, where("createdBy", "==", user.uid));
      } else {
        q = query(
          eventsCollection,
          where("status", "==", selectedFilter),
          where("createdBy", "==", user.uid)
        );
      }

      const eventSnapshot = await getDocs(q);

      // Map the data from Firebase to an array of event objects
      const eventData = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventData);
    }
  };

  useEffect(() => {
    fetchEventsByFilter();
  
    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      // Unsubscribe from the Firestore listener
      // Define the Firestore collection and query
      const firestore = getFirestore();
      const eventsCollection = collection(firestore, "Events");

      // Get the currently authenticated user
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Construct a Firestore query for the listener
        const q =
          selectedFilter === "all"
            ? query(eventsCollection, where("createdBy", "==", user.uid))
            : query(
                eventsCollection,
                where(
                  "status",
                  "==",
                  selectedFilter,
                  "createdBy",
                  "==",
                  user.uid
                )
              );

        // Define the real-time listener for changes
        const unsubscribe = onSnapshot(q, () => {
          // Handle real-time updates as needed
        });

        // Unsubscribe from the listener to prevent memory leaks
        unsubscribe();
      }
    };
  }, [selectedFilter, eventCreated]);

  // Filter events based on the search query
  const searchedEvents = events.filter((event) => {
    return event.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <Header title={"Event List"} />
      <View style={{ backgroundColor: "rgba(11,37,69,0.90)" }}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[
              styles.searchInput,
              {
                width: 260,
                alignItems: "center",
              },
            ]}
            placeholder="Search for events..."
            placeholderTextColor={"grey"}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <Button
            title={"Create Event"}
            style={styles.createEventButton}
            onPress={toggleModal}
          />
        </View>
        <View style={styles.filterButtons}>
          <FilterButton
            label="All"
            selected={selectedFilter === "all"}
            onPress={() => {
              setSelectedFilter("all");
              fetchEventsByFilter();
            }}
          />
          <FilterButton
            label="Upcoming"
            selected={selectedFilter === "upcoming"}
            onPress={() => {
              setSelectedFilter("upcoming");
              fetchEventsByFilter();
            }}
          />
          <FilterButton
            label="Ongoing"
            selected={selectedFilter === "ongoing"}
            onPress={() => {
              setSelectedFilter("ongoing");
              fetchEventsByFilter();
            }}
          />
          <FilterButton
            label="Completed"
            selected={selectedFilter === "completed"}
            onPress={() => {
              setSelectedFilter("completed");
              fetchEventsByFilter();
            }}
          />
        </View>
      </View>
      {/*  Create Event form Modal */}
      <CreateEvent
        isModalVisible={isModalVisible}
        eventName={eventName}
        eventDate={eventDate}
        eventLocation={eventLocation}
        eventTime={eventTime}
        setEventTime={setEventTime}
        setEventName={setEventName}
        setEventDate={setEventDate}
        setEventLocation={setEventLocation}
        handleSubmit={handleSubmit}
        toggleModal={toggleModal}
      />
      {/* Events List */}
      <ScrollView style={styles.scrollableSection}>
        <View style={{ marginTop: 12 }}>
          {searchedEvents.length > 0 ? (
            searchedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => {
                  // Navigate to the Event Details screen with event data
                  navigation.navigate("EventDetails", { event });
                }}
              >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 8,
                  color: "#F2E8A2",
                }}
              >
                {event.name}
              </Text>
              <Text style={{ color: "white" }}>
              Date: {event.date ? format(event.date.toDate(), 'yyyy-MM-dd') : 'N/A'}
              </Text>
              <Text style={{ color: "white" }}>
              Time: {event.time ? format(event.time.toDate(), 'h:mm a') : 'N/A'}
              </Text>
              <Text style={{ color: "white" }}>Location: {event.location}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyState}>No Events Found.</Text>
        )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    margin: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F2E8A2",
    borderRadius: 8,
    backgroundColor: "white",
  },
  createEventButton: {
    alignSelf: "center",
    backgroundColor: "#753742",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#d9ae94",
    shadowColor: "#F2E8A2",
    marginTop: 14,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  scrollableSection: {
    borderTopWidth: 0.75,
    borderColor: "#F2E8A2",
    backgroundColor: "rgba(11,37,69,0.90)'",
  },
  eventCard: {
    marginHorizontal: 16,
    backgroundColor: "#753742",
    borderColor: "#d9ae94",
    shadowColor: "#F2E8A2", // Neomorphism shadow color
    shadowOpacity: 1, // Neomorphism shadow opacity
    shadowOffset: 20,
    shadowRadius: 1.5,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  emptyState: {
    fontSize: 16,
    color: "#F2E8A2",
    fontWeight: "900",
    textAlign: "center",
  },
});

export default EventList;
