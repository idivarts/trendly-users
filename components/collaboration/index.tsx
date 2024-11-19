import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import SearchComponent from "@/components/SearchComponent";
import JobCard from "./CollaborationCard";
import CollaborationFilter from "@/components/FilterModal";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/Collections.styles";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { ActivityIndicator } from "react-native-paper";
import Colors from "@/constants/Colors";
import BottomSheetActions from "../BottomSheetActions";
import EmptyState from "../ui/empty-state";

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
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedBrands = await fetchBrands(); // Fetch brands and store in a variable
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

    // Use Firestore sorting by "timeStamp" in descending order (newest first)
    const collabQuery = query(collabRef, orderBy("timeStamp", "desc"));
    const snapshot = await getDocs(collabQuery);

    const data = snapshot.docs.map((doc) => {
      const docData = doc.data() as ICollaborationAddCardProps;

      return {
        ...docData,
        id: doc.id,
      };
    });

    const collabsWithBrandNames = data.map((collab) => ({
      ...collab,
      brandName: brandsMap[collab.brandId]?.name || "Unknown Brand",
      paymentVerified:
        brandsMap[collab.brandId]?.paymentMethodVerified || false,
    }));

    setCollabs(collabsWithBrandNames);
  };

  const toggleFilterModal = () => {
    setFilterVisible(!filterVisible);
  };

  const filteredList = collabs.filter((job) => {
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

  const styles = stylesFn(theme);

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
            color={Colors(theme).primary}
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
        {
          filteredList.length === 0 ? (
            <EmptyState
              hideAction
              image={require("@/assets/images/illustration1.png")}
              subtitle="We are working hard to bring more brands and collaborations for you on Trendly. Thanks for your patience."
              title="Oops! No Collaborations!"
            />
          ) : (
            <FlatList
              data={filteredList}
              renderItem={({ item }) => (
                <JobCard
                  {...item}
                  cardType={"collaboration"}
                  onOpenBottomSheet={openBottomSheet}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
            />
          )
        }
      </View>
      {
        isVisible && (
          <BottomSheetActions
            cardId={selectedCollabId || ""} // Pass the selected collab id
            cardType="collaboration"
            snapPointsRange={["25%", "50%"]}
            isVisible={isVisible}
            onClose={closeBottomSheet}
            key={selectedCollabId} // Ensure the BottomSheetActions re-renders with new id
          />
        )
      }
      {
        filterVisible && (
          <CollaborationFilter
            categories={getUniqueValues(collabs, "promotionType")}
            jobTypes={getUniqueValues(collabs, "collaborationType")}
            currentCategory={selectedCategory}
            currentJobType={selectedJobType}
            currentSalaryRange={salaryRange}
            isVisible={filterVisible}
            setSelectedCategory={setSelectedCategory}
            setSelectedJobType={setSelectedJobType}
            setSalaryRange={setSalaryRange}
            onClose={toggleFilterModal}
          />
        )
      }
    </AppLayout>
  );
};

export default Collaboration;
