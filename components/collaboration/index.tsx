import React, { useState, useEffect } from "react";
import { View, FlatList, Modal } from "react-native";
import SearchComponent from "@/components/SearchComponent";
import JobCard from "./CollaborationCard";
import CollaborationFilter from "@/components/FilterModal";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/Collections.styles";
import { collection, getDocs } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { signInAnonymously } from "firebase/auth";
import { AuthApp } from "@/utils/auth";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { ActivityIndicator } from "react-native-paper";

interface ICollaborationAddCardProps extends ICollaboration {
  name: string;
  brandName: string;
  paymentVerified?: boolean;
  appliedCount?: number;
  aiSuccessRate?: string;
  id: string;
  brandHireRate?: string;
}

const Collaboration = () => {
  const getUniqueValues = (array: any[], key: string) => {
    return ["All", ...new Set(array.map((item) => item[key]))];
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 10000]);
  const [collabs, setCollabs] = useState<ICollaborationAddCardProps[]>([]);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await signInAnonymously(AuthApp);
      const fetchedBrands = await fetchBrands(); // Fetch brands and store in a variable
      console.log("Fetched Brands: ", fetchedBrands);
      await fetchCollabs(fetchedBrands); // Pass the fetched brands to fetchCollabs
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchBrands = async () => {
    const brandRef = collection(FirestoreDB, "brands");
    const snapshot = await getDocs(brandRef);
    const brandData = snapshot.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data() as IBrands;
      return { ...data, id };
    });

    const brandMap: {
      [key: string]: { name: string; paymentMethodVerified: boolean };
    } = {};
    brandData.forEach((brand) => {
      brandMap[brand.id] = {
        name: brand.name,
        paymentMethodVerified: brand.paymentMethodVerified || false,
      };
    });

    return brandMap;
  };

  const fetchCollabs = async (brandsMap: {
    [key: string]: { name: string; paymentMethodVerified: boolean };
  }) => {
    const collabRef = collection(FirestoreDB, "collaborations");
    const snapshot = await getDocs(collabRef);
    const data = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as ICollaborationAddCardProps)
    );

    const collabsWithBrandNames = data.map((collab) => ({
      ...collab,
      brandName: brandsMap[collab.brandId].name || "Unknown Brand",
      paymentVerified:
        brandsMap[collab.brandId]?.paymentMethodVerified || false,
    }));

    setCollabs(collabsWithBrandNames);
  };

  const toggleFilterModal = () => {
    setFilterVisible(!filterVisible);
  };

  console.log(
    "This is selected",
    selectedCategory,
    selectedJobType,
    salaryRange
  );

  const filteredList = collabs.filter((job) => {
    console.log("This is job", job);

    return (
      (job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery === "") &&
      (selectedCategory === "" ||
        job.promotionType.includes(selectedCategory) ||
        selectedCategory === "All") &&
      (selectedJobType === "" ||
        job.collaborationType.includes(selectedJobType) ||
        selectedJobType === "All") &&
      job.budget.min &&
      job.budget.min >= salaryRange[0] &&
      job.budget.max &&
      job.budget.max <= salaryRange[1]
    );
  });

  const styles = createStyles(colors);

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <SearchComponent
              ToggleModal={toggleFilterModal}
              setSearchQuery={setSearchQuery}
            />
          </View>
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            size="large"
          />
        </View>
      </AppLayout>
    );
  }

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
          keyExtractor={(item) => item.name}
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
                categories={getUniqueValues(collabs, "promotionType")}
                jobTypes={getUniqueValues(collabs, "collaborationType")}
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