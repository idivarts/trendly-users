import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Chip, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { createStyles } from "@/styles/FilterModal.styles";
import { useTheme } from "@react-navigation/native";

interface CollaborationFilterProps {
  onClose: () => void;
  setSelectedCategory: (category: string) => void;
  setSelectedJobType: (jobType: string) => void;
  setSalaryRange: (salaryRange: number[]) => void;
  currentCategory: string;
  currentJobType: string;
  currentSalaryRange: number[];
  categories: any[];
  jobTypes: any[];
}

const CollaborationFilter = ({
  onClose,
  setSelectedCategory,
  setSelectedJobType,
  setSalaryRange,
  currentCategory,
  currentJobType,
  currentSalaryRange,
  categories,
  jobTypes,
}: CollaborationFilterProps) => {
  const [localSelectedCategory, setLocalSelectedCategory] = useState(
    currentCategory || "All"
  );
  const [localSelectedJobType, setLocalSelectedJobType] = useState(
    currentJobType || "All"
  );
  const [localSalaryRange, setLocalSalaryRange] = useState<number[]>(
    currentSalaryRange || [0, 999999]
  );

  const applyFilters = () => {
    setSelectedCategory(localSelectedCategory);
    setSelectedJobType(localSelectedJobType);
    setSalaryRange(localSalaryRange);
    onClose();
  };

  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.chipContainer}>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={localSelectedCategory === category}
            onPress={() => setLocalSelectedCategory(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
      </View>

      {/* Salaries Section */}
      <Text style={styles.sectionTitle}>Salaries</Text>
      <View style={styles.salaryContainer}>
        <Text style={styles.salaryLabel}>
          Min Salary: ${localSalaryRange[0].toLocaleString()}
        </Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={localSalaryRange[1]}
          step={1000}
          value={localSalaryRange[0]}
          onValueChange={(value) =>
            setLocalSalaryRange([value, localSalaryRange[1]])
          }
        />
      </View>
      <View style={styles.salaryContainer}>
        <Text style={styles.salaryLabel}>
          Max Salary: ${localSalaryRange[1].toLocaleString()}
        </Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={localSalaryRange[0]}
          maximumValue={999999}
          step={1000}
          value={localSalaryRange[1]}
          onValueChange={(value) =>
            setLocalSalaryRange([localSalaryRange[0], value])
          }
        />
      </View>

      {/* Job Types Section */}
      <Text style={styles.sectionTitle}>Job Types</Text>
      <View style={styles.chipContainer}>
        {jobTypes.map((jobType) => (
          <Chip
            key={jobType}
            selected={localSelectedJobType === jobType}
            onPress={() => setLocalSelectedJobType(jobType)}
            style={styles.chip}
          >
            {jobType}
          </Chip>
        ))}
      </View>

      {/* Apply Button */}
      <Button
        mode="contained"
        onPress={applyFilters}
        style={styles.applyButton}
      >
        Apply Filters
      </Button>
    </ScrollView>
  );
};

export default CollaborationFilter;