import React, { useState } from "react";
import { View, FlatList, Modal } from "react-native";
import SearchComponent from "@/components/SearchComponent";
import JobCard from "./CollaborationCard";
import CollaborationFilter from "@/components/FilterModal";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/Collections.styles";
import { Collabs } from "@/constants/Collabs";

const getUniqueValues = (array: string[], key: number) => {
  return ["All", ...new Set(array.map((item) => item[key]))];
};

const Collaboration = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 999999]);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  console.log(colors.background);

  const toggleFilterModal = () => {
    setFilterVisible(!filterVisible);
  };

  const filteredList = Collabs.filter((job) => {
    return (
      (job.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.collaborationName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        searchQuery === "") &&
      (selectedCategory === "" ||
        job.promotionType.includes(selectedCategory) ||
        selectedCategory === "All") &&
      (selectedJobType === "" ||
        job.collaborationType.includes(selectedJobType) ||
        selectedJobType === "All")
    );
  });

  const getUniqueValues = (
    array: typeof Collabs,
    key: keyof (typeof Collabs)[0]
  ) => {
    return ["All", ...new Set(array.map((item) => item[key]))];
  };

  const categories = getUniqueValues(Collabs, "promotionType");
  const jobTypes = getUniqueValues(Collabs, "collaborationType");

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchComponent
            ToggleModal={toggleFilterModal}
            setSearchQuery={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredList}
          renderItem={({ item }) => (
            <JobCard {...item} cardType={"collaboration"} />
          )}
          keyExtractor={(item) => item.collaborationName}
          contentContainerStyle={styles.jobList}
        />

        <Modal
          visible={filterVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleFilterModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CollaborationFilter
                categories={categories}
                jobTypes={jobTypes}
                currentCategory={selectedCategory}
                currentJobType={selectedJobType}
                currentSalaryRange={salaryRange}
                setSelectedCategory={setSelectedCategory}
                setSelectedJobType={setSelectedJobType}
                setSalaryRange={setSalaryRange}
                onClose={toggleFilterModal}
              />
            </View>
          </View>
        </Modal>
      </View>
    </AppLayout>
  );
};

export default Collaboration;
