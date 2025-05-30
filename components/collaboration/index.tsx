import CollaborationFilter from "@/components/FilterModal";
import SearchComponent from "@/components/SearchComponent";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { useScrollContext } from "@/shared-libs/contexts/scroll-context";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useInfiniteScroll } from "@/shared-libs/utils/infinite-scroll";
import Carousel from "@/shared-uis/components/carousel/carousel";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Collections.styles";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { IOScrollView } from "react-native-intersection-observer";
import BottomSheetActions from "../BottomSheetActions";
import { View } from "../theme/Themed";
import EmptyState from "../ui/empty-state";
import CollaborationDetails from "./card-components/CollaborationDetails";
import CollaborationHeader from "./card-components/CollaborationHeader";
import CollaborationStats from "./card-components/CollaborationStats";
;

interface ICollaborationAddCardProps extends ICollaboration {
  name: string;
  brandName: string;
  paymentVerified?: boolean;
  appliedCount?: number;
  aiSuccessRate?: string;
  id: string;
  brandImage?: string;
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
  const [salaryRange, setSalaryRange] = useState([0, 100000]);
  // const [collabs, setCollabs] = useState<ICollaborationAddCardProps[]>([]);
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  // const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { xl } = useBreakpoints();

  const collabRef = collection(FirestoreDB, "collaborations");
  const collabQuery = query(collabRef, where("status", "==", "active"), orderBy("timeStamp", "desc"));
  const { onScrollEvent, data: collabs, loading } = useInfiniteScroll<ICollaborationAddCardProps>(collabQuery)

  const [brandMap, setBrandMap] = useState<{
    [key: string]: {
      name: string;
      paymentMethodVerified: boolean;
      image: string;
    };
  }>({})


  const fetchData = async () => {
    await fetchBrands(); // Fetch brands and store in a variable
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchBrands = async () => {
    const brandRef = collection(FirestoreDB, "brands");
    const snapshot = await getDocs(brandRef);
    const brandData = snapshot.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data() as IBrands;
      return { ...data, id };
    });

    const brandMap: {
      [key: string]: {
        name: string;
        paymentMethodVerified: boolean;
        image: string;
      };
    } = {};
    brandData.forEach((brand) => {
      brandMap[brand.id] = {
        name: brand.name,
        paymentMethodVerified: brand.paymentMethodVerified || false,
        image: brand.image || "",
      };
    });

    setBrandMap(brandMap)
  };

  const toggleFilterModal = () => {
    setFilterVisible(!filterVisible);
  };

  const filteredList = collabs.filter((collab) => {
    return collab.name.toLowerCase().includes(searchQuery.toLowerCase())
      || collab.description?.toLowerCase().includes(searchQuery.toLowerCase())
    // Create a proper filter keys
  }).map((collab) => ({
    ...collab,
    id: collab.documentId,
    brandName: brandMap[collab.brandId]?.name || "Unknown Brand",
    brandImage: brandMap[collab.brandId]?.image || "",
    paymentVerified:
      brandMap[collab.brandId]?.paymentMethodVerified || false,
  }));

  // const [scHeight, setScHeight] = useState(0)
  const { scrollRef, setScrollHeight } = useScrollContext()
  const styles = stylesFn(theme);

  if (loading && collabs.length == 0) {
    return (
      <AppLayout>
        <View
          style={[
            styles.container,
            {
              width: xl ? MAX_WIDTH_WEB : "100%",
            },
          ]}
        >
          <View
            style={[
              styles.searchContainer,
              {
                paddingHorizontal: xl ? 0 : 16,
              },
            ]}
          >
            <SearchComponent
              ToggleModal={toggleFilterModal}
              setSearchQuery={setSearchQuery}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={Colors(theme).primary} size="large" />
          </View>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View
        style={[
          styles.container,
          {
            width: xl ? MAX_WIDTH_WEB : "100%",
          },
        ]}
      >
        <View
          style={[
            styles.searchContainer,
            {
              paddingHorizontal: xl ? 0 : 16,
            },
          ]}
        >
          <SearchComponent
            ToggleModal={toggleFilterModal}
            setSearchQuery={setSearchQuery}
          />
        </View>
        <IOScrollView ref={scrollRef} onScroll={(e) => {
          setScrollHeight?.(e.nativeEvent.contentOffset?.y || 0)
          onScrollEvent(e)
        }}>
          {filteredList.length === 0 ? (
            <EmptyState
              hideAction
              image={require("@/assets/images/illustration1.png")}
              subtitle="We are working hard to bring more brands and collaborations for you on Trendly. Thanks for your patience."
              title="Oops! No Collaborations!"
            />
          ) : (
            <>
              <FlatList
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
                data={filteredList}
                renderItem={({ item }) => (
                  <View
                    key={item.id}
                    style={{
                      width: "100%",
                      borderWidth: 0.3,
                      borderColor: Colors(theme).gray300,
                      gap: 8,
                      borderRadius: 5,
                      paddingBottom: 16,
                      overflow: "hidden",
                    }}
                  >
                    <CollaborationHeader
                      cardId={item.id}
                      cardType="collaboration"
                      brand={{
                        image: item.brandImage || "",
                        name: item.brandName,
                        paymentVerified: item.paymentVerified || false,
                      }}
                      collaboration={{
                        collabId: item.id,
                        collabName: item.name,
                        timePosted: item.timeStamp,
                      }}
                      onOpenBottomSheet={() => openBottomSheet(item.id)}
                    />
                    {item.attachments && item.attachments.length > 0 && (
                      <Carousel
                        theme={theme}
                        onImagePress={() => {
                          router.push({
                            // @ts-ignore
                            pathname: `/collaboration-details/${item.id}`,
                            params: {
                              cardType: "collaboration",
                            },
                          });
                        }}
                        data={
                          item.attachments?.map((attachment) =>
                            processRawAttachment(attachment)
                          ) || []
                        }
                        carouselWidth={
                          xl ? MAX_WIDTH_WEB : Dimensions.get("window").width
                        }
                      />
                    )}
                    <Pressable
                      onPress={() => {
                        router.push({
                          // @ts-ignore
                          pathname: `/collaboration-details/${item.id}`,
                          params: {
                            cardType: "collaboration",
                          },
                        });
                      }}
                    >
                      <CollaborationDetails
                        collaborationDetails={{
                          collabDescription: item.description || "",
                          promotionType: item.promotionType,
                          location: item.location,
                          platform: item.platform,
                          contentType: item.contentFormat,
                        }}
                      />
                      <CollaborationStats
                        influencerCount={item.numberOfInfluencersNeeded}
                        collabID={item.id}
                        budget={item.budget ? item.budget : { min: 0, max: 0 }}
                        brandHireRate={item.brandHireRate || ""}
                      />
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={{
                  flexGrow: 1,
                  paddingTop: 8,
                }}
                contentContainerStyle={{
                  gap: 16,
                  paddingBottom: 24,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              />
              {loading && <ActivityIndicator size={"small"} />}
            </>
          )}
        </IOScrollView>
      </View>
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""} // Pass the selected collab id
          cardType="collaboration"
          snapPointsRange={["25%", "50%"]}
          isVisible={isVisible}
          onClose={closeBottomSheet}
          key={selectedCollabId} // Ensure the BottomSheetActions re-renders with new id
        />
      )}
      {filterVisible && (
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
      )}
    </AppLayout>
  );
};

export default Collaboration;
