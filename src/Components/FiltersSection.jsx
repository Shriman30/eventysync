import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FilterButton from "./FilterButton";

const FiltersSection = ({
  selectedFilter,
  setSelectedFilter,
  fetchEventsByFilter,
}) => {
  return (
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
        selected={selectedFilter === "complete"}
        onPress={() => {
          setSelectedFilter("complete");
          fetchEventsByFilter();
        }}
      />
    </View>
  );
};

export default React.memo(FiltersSection);

const styles = StyleSheet.create({
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
});
