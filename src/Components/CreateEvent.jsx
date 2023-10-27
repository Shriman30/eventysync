import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "react-native-modal-datetime-picker";

const CreateEvent = ({
  eventName,
  setEventName,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventLocation,
  setEventLocation,
  isModalVisible,
  handleSubmit,
  toggleModal,
}) => {
  // Date and Time picker state
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    setEventDate(date);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    setEventTime(time);
  };

  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create a New Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={eventName}
            onChangeText={(text) => setEventName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={eventLocation}
            onChangeText={(text) => setEventLocation(text)}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F2E8A2",
                justifyContent: "center",
                alignSelf: "center",
                width: 100,
                height: 40,
                marginVertical: 16,
                marginHorizontal: 12,
                borderWidth: 0.5,
                borderColor: "#753742",
                borderRadius: 4,
              }}
              onPress={showDatePicker}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#753742",
                }}
              >
                {eventDate ? eventDate.toLocaleDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#F2E8A2",
                justifyContent: "center",
                alignSelf: "center",
                width: 100,
                height: 40,
                marginVertical: 12,
                borderRadius: 4,
              }}
              onPress={showTimePicker}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#753742",
                }}
              >
                {eventTime ? eventTime.toLocaleTimeString() : "Select Time"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginVertical: 12, alignSelf: "center" }}
            onPress={toggleModal}
          >
            <Text style={{ color: "#F2E8A2", fontWeight: 500 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </Modal>
    </View>
  );
};

export default React.memo(CreateEvent);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "rgba(11,37,69,0.90)",
    padding: 16,
    borderRadius: 10,
    borderColor: "#d9ae94",
    shadowColor: "#F2E8A2", // Neomorphism shadow color
    shadowOpacity: 1, // Neomorphism shadow opacity
    shadowOffset: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#F2E8A2",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 8,
    color: "#F2E8A2",
    fontWeight: "600",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#753742",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
