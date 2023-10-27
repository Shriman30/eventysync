import React, { useState, useEffect } from "react";
import {View,Text,ScrollView,TouchableOpacity,TextInput,StyleSheet} from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import {getFirestore,collection,query,where,addDoc,getDocs,onSnapshot,updateDoc,deleteDoc,doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format, isToday } from "date-fns";
import Header from "../../Components/Header";
import CreateEvent from "../../Components/CreateEvent";
import FiltersSection from "../../Components/FiltersSection";

// Color constants:
const textColor = "#F2E8A2";
const primaryColor = "#d9ae94";
const widgetColor = "#753742";

const EventList = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  // state to load the user's events
  const [events, setEvents] = useState([]);

  // states to manage event creation and modal:
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCreated, setEventCreated] = useState(false);

  // Function to open and close the Create Event modal.
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to submit new event entry into the database.
  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      // Ensure that the eventDate is a valid Date object (you may need to parse it)
      if (!eventDate || !(eventDate instanceof Date)) {
        console.error("Invalid event date.");
        return;
      }

      const currentDate = new Date();
      // Remove time components from both dates
      eventDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      // Determine the status based on the selected date
      let newStatus = "upcoming";
      if (eventDate < currentDate) {
        newStatus = "complete";
      } else if (isToday(eventDate)) {
        newStatus = "ongoing";
      }

      // Create a new event object
      const newEvent = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        createdBy: user.uid,
        status: newStatus,
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
      setEventCreated(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Function to fetch events from Firebase based on the status of the event and the authenticated user
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

  // Function to periodically check and update event statuses.
  const updateEventStatuses = async () => {
    const firestore = getFirestore();
    const eventsCollection = collection(firestore, "Events");

    // Get the current date without the time component
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    const q = query(
      eventsCollection,
      where("status", "==", "upcoming"),
      where("date", "<=", currentDate)
    );

    const eventSnapshot = await getDocs(q);

    // Loop through the events that need to be updated
    eventSnapshot.forEach(async (eventDoc) => {
      const event = eventDoc.data();
      const eventRef = doc(eventsCollection, eventDoc.id);

      // Get the date part of the event's date field
      const eventDate = new Date(event.date);
      eventDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

      // Calculate the new status based on the date part
      let newStatus = event.status; // initialize to event's current status

      if (eventDate.getTime() <= currentDate.getTime()) {
        newStatus = "ongoing";
      }

      // Update the event status in Firestore if it's different
      if (newStatus !== event.status) {
        await updateDoc(eventRef, { status: newStatus });
      }
    });
  };

  // To update the event status periodically every minute.
  useEffect(() => {
    updateEventStatuses();
    // Set an interval to call the function every minute (adjust as needed)
    const intervalId = setInterval(updateEventStatuses, 60000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // To retrieve the events based on user's filter selection.
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
          // Handle real-time updates as needed falert
        });

        // Unsubscribe from the listener to prevent memory leaks
        unsubscribe();
      }
    };
  }, [selectedFilter, eventCreated]);

  // Function to filter events based on the search query.
  const searchedEvents = events.filter((event) => {
    return event.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Function to mark an event as completed.
  const handleMarkEventCompletion = async (event) => {
    const firestore = getFirestore();
    const eventsCollection = collection(firestore, "Events");

    // Calculate the new status
    let newStatus = "ongoing";
    if (event.status === "ongoing") {
      newStatus = "complete";
    }

    // Update the event status in Firestore
    const eventRef = doc(eventsCollection, event.id);
    await updateDoc(eventRef, { status: newStatus });

    // Re-fetch the events to update the UI
    fetchEventsByFilter();
  };

  // Function to delete an event.
  const handleEventDelete = async (event) => {
    try {
      const firestore = getFirestore();
      const eventsCollection = collection(firestore, "Events");
      const eventRef = doc(eventsCollection, event.id);
      await deleteDoc(eventRef);
      // Re-fetch the events to update the UI
      fetchEventsByFilter();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Render UI 
  return (
    <View style={styles.container}>
      <Header title={"Event List"} />
      <View style={{ backgroundColor: "rgba(11,37,69,0.90)" }}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.searchInput}
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

        {/* Filters section */}
        <FiltersSection
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          fetchEventsByFilter={fetchEventsByFilter}
        />
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
                  navigation.navigate("EventDetails", { event });
                }}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.eventName}>{event.name}</Text>
                  </View>
                  {/* Event info section */}
                  <View>
                    <Text style={styles.eventInfo}>
                      Date:{" "}
                      {event.date
                        ? format(event.date.toDate(), "yyyy-MM-dd")
                        : "N/A"}
                    </Text>
                    <Text style={styles.eventInfo}>
                      Time:{" "}
                      {event.time
                        ? format(event.time.toDate(), "h:mm a")
                        : "N/A"}
                    </Text>
                    <Text style={styles.eventInfo}>
                      Location: {event.location}
                    </Text>
                  </View>

                  {/* Complete / Delete Event section */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handleMarkEventCompletion(event)}
                      style={styles.completeButton}
                    >
                      <Text style={{ color: textColor }}>Mark Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEventDelete(event)}
                      style={[styles.completeButton, styles.deleteButton]}
                    >
                      <Text style={{ color: textColor }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    width: 260,
    alignItems: "center",
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

  scrollableSection: {
    borderTopWidth: 0.75,
    borderColor: "#F2E8A2",
    backgroundColor: "rgba(11,37,69,0.90)'",
  },
  eventCard: {
    marginHorizontal: 16,
    backgroundColor: widgetColor, 
    borderRadius: 8,
    elevation: 2,
    padding: 12,
    marginBottom: 16,
    marginRight: 12,
    borderColor: primaryColor, // Border color for Glassmorphism effect
    borderWidth: 1, // Border width for Glassmorphism effect
    shadowColor: textColor, // Neomorphism shadow color
    shadowOpacity: 1, // Neomorphism shadow opacity
    shadowOffset: 20,
    shadowRadius: 1,
    alignSelf: "center",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#F2E8A2",
  },
  eventInfo: { 
    color: "white" 
  },
  emptyState: {
    fontSize: 16,
    color: "#F2E8A2",
    fontWeight: "900",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  completeButton: {
    backgroundColor: "#18694A",
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
  deleteButton: {
    backgroundColor: "#800000",
    shadowColor: textColor,
    shadowRadius: 1,
    shadowOpacity: 0.5,
    shadowOffset: 20,
  },
});

export default React.memo(EventList);
