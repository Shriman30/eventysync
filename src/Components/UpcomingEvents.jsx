import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const UpcomingEventsSection = ({ navigation }) => {


  const eventsData = [
    {
      id: "1",
      name: "Event 1",
      date: "2023-10-25",
      time: "10:00 AM",
      location: "Venue 1",
    },
    {
      id: "2",
      name: "Event 2",
      date: "2023-11-05",
      time: "2:00 PM",
      location: "Venue 2",
    },
    {
      id: "3",
      name: "Event 3",
      date: "2023-11-05",
      time: "2:00 PM",
      location: "Venue 2",
    },
    // Add more event objects here...
  ];

  const goToEventDetails = () => {
    navigation.navigate("EventDetails");
  };

  return (
    <View style={styles.section}>
      <FlatList
        horizontal
        data={eventsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventStatusIndicator}></View>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={{color:'white'}}>Date: {item.date}</Text>
            <Text style={{color:'white'}}>Time: {item.time}</Text>
            <Text style={{color:'white'}}>Location: {item.location}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={goToEventDetails}
              >
                <Text style={{ textAlign: "center" ,color:"#F3ECA8"}}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton,{backgroundColor:"#18694A"}]}>
                <Text style={{ textAlign: "center",color:"#F3ECA8"}}>Mark Completed</Text>
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
    shadowOffset:20,
    shadowRadius:1,
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
    shadowColor:textColor,
    shadowRadius:1,
    shadowOpacity:0.5,
    shadowOffset:20,
  },
});

export default UpcomingEventsSection;
