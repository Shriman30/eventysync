import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'

const FilterButton = ({ label, selected, onPress }) => (
 (  <TouchableOpacity
      style={[styles.filterButton, selected && styles.selectedFilter]}
      onPress={onPress}
    >
      <Text style={selected ? styles.selectedText : styles.filterText}>
        {label}
      </Text>
    </TouchableOpacity>)
  );

export default React.memo(FilterButton);

const styles = StyleSheet.create({  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2E8A2",
  },
  filterText: {
    color: "#F2E8A2",
  },
  selectedFilter: {
    backgroundColor: "#753742",
  },
  selectedText: {
    color: "white",
  },
})