import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
import SearchComponent from "@/components/SearchComponent";
import JobCard from "@/components/CollaborationCard";
import CollaborationFilter from "@/components/FilterModal";
import AppLayout from "@/App-Layout";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/Collections.styles";

const JobCollection = [
  {
    collaborationName: "UI/UX Design Collaboration",
    brandName: "Google",
    shortDescription:
      "Google is looking for a UI/UX designer to help design their new mobile app.",
    postedDate: "2 days ago",
    cost: "Paid",
    paymentVerified: true,
    promotionType: "Sponsored",
    collaborationType: "Design",
    influencersNeeded: 5,
    appliedCount: 10,
    aiSuccessRate: "80%",
    brandHireRate: "70%",
    location: "Remote",
    logo: "https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg",
  },
  {
    collaborationName: "Web Development Collaboration",
    brandName: "Facebook",
    shortDescription:
      "Facebook is looking for a web developer to help build their new website.",
    postedDate: "1 week ago",
    cost: "Paid",
    paymentVerified: true,
    promotionType: "Sponsored",
    collaborationType: "Development",
    influencersNeeded: 3,
    appliedCount: 5,
    aiSuccessRate: "90%",
    brandHireRate: "80%",
    location: "Remote",
    logo: "https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg",
  },
  {
    collaborationName: "Mobile App Development Collaboration",
    brandName: "Amazon",
    shortDescription:
      "Amazon is looking for a mobile app developer to help build their new app.",
    postedDate: "1 month ago",
    cost: "Paid",
    paymentVerified: true,
    promotionType: "Sponsored",
    collaborationType: "Development",
    influencersNeeded: 2,
    appliedCount: 3,
    aiSuccessRate: "95%",
    location: "Remote",
    brandHireRate: "90%",
    logo: "https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg",
  },
];

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

  const filteredList = JobCollection.filter((job) => {
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
    array: typeof JobCollection,
    key: keyof (typeof JobCollection)[0]
  ) => {
    return ["All", ...new Set(array.map((item) => item[key]))];
  };

  const categories = getUniqueValues(JobCollection, "promotionType");
  const jobTypes = getUniqueValues(JobCollection, "collaborationType");

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
          renderItem={({ item }) => <JobCard {...item} />}
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
