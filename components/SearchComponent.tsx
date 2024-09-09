import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchComponentProps {
  ToggleModal?: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  ToggleModal,
  setSearchQuery,
}) => {
  const [localQuery, setLocalQuery] = useState("");

  const handleChangeText = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
  };

  const handleClearText = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search-outline"
        size={24}
        color="#555"
        style={styles.icon}
      />
      <TextInput
        value={localQuery}
        onChangeText={handleChangeText}
        placeholder="UI/UX Designs"
        style={styles.searchInput}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        theme={{ roundness: 25 }}
      />
      {localQuery ? (
        <Ionicons
          name="close-outline"
          size={24}
          color="#555"
          style={styles.icon}
          onPress={handleClearText}
        />
      ) : null}
      <TouchableOpacity
        onPress={() => {
          if (ToggleModal) ToggleModal(true);
        }}
      >
        <Ionicons
          name="options-outline"
          size={24}
          color="#555"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 25,
    borderWidth: 0.3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default SearchComponent;
