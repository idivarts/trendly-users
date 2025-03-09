import BottomSheetActions from "@/components/BottomSheetActions";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import ScrollMedia from "@/shared-uis/components/carousel/scroll-media";
import { stylesFn } from "@/styles/Proposal.styles";
import { processRawAttachment } from "@/utils/attachments";
import { FirestoreDB } from "@/utils/firestore";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import {
  collection,
  collectionGroup,
  doc as firebaseDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl
} from "react-native";
import CollaborationDetails from "../collaboration/card-components/CollaborationDetails";
import CollaborationHeader from "../collaboration/card-components/CollaborationHeader";
import { MediaItem } from "../collaboration/render-media-item";
import EmptyState from "../ui/empty-state";

const Applications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [notPendingProposals, setNotPendingProposals] = useState<number>();
  const { user } = useAuthContext();

  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { xl } = useBreakpoints();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProposals();
    setRefreshing(false);
  };

  const fetchProposals = async () => {
    try {
      const applicationCol = collectionGroup(FirestoreDB, "applications");
      const querySnap = query(applicationCol, where("userId", "==", user?.id));
      const applicationSnapshot = await getDocs(querySnap);
      const applicationData = applicationSnapshot.docs.map((doc) => ({
        id: doc.id,
        status: doc.data().status,
        collaborationId: doc.data().collaborationId,
        ...doc.data(),
      }));

      let totalNotPendingApplications = 0;

      setProposals([]);

      const applicationWithCollab = await Promise.all(
        applicationData.map(async (application) => {
          const collabDoc = firebaseDoc(
            collection(FirestoreDB, "collaborations"),
            application.collaborationId
          );
          const collabData = await getDoc(collabDoc);
          if (!collabData.exists()) {
            return null;
          }

          const brandDoc = firebaseDoc(
            collection(FirestoreDB, "brands"),
            collabData.data().brandId
          );
          const brandData = await getDoc(brandDoc);
          if (!brandData.exists()) {
            return null;
          }

          if (application.status !== "pending") {
            totalNotPendingApplications += 1;
          }

          if (application.status === "pending") {
            setProposals((prev) => [
              ...prev,
              {
                ...collabData.data(),
                id: collabData.id,
                brandName: brandData.data().name,
                brandImage: brandData.data().image,
                paymentVerified: brandData.data().paymentMethodVerified,
                applications: applicationData,
              },
            ]);
          }

          return {
            ...collabData.data(),
            id: collabData.id,
            brandName: brandData.data().name,
            brandImage: brandData.data().image,
            paymentVerified: brandData.data().paymentMethodVerified,
            applications: applicationData,
          };
        })
      );

      const validProposals = applicationWithCollab.filter((proposal) => {
        return proposal !== null;
      });

      setNotPendingProposals(totalNotPendingApplications);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const pendingProposals = useMemo(
    () =>
      proposals.filter((proposal) => {
        proposal.applications = proposal.applications.filter(
          (application: IApplications) => application.status === "pending"
        );
        return proposal.applications.length !== 0;
      }),
    [proposals]
  );

  if (isLoading) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors(theme).primary} />
        </View>
      </AppLayout>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: xl ? MAX_WIDTH_WEB : "100%",
        marginHorizontal: "auto",
      }}
    >
      {proposals.length === 0 && notPendingProposals === 0 ? (
        <EmptyState
          image={require("@/assets/images/illustration6.png")}
          subtitle="Start Applying today and get exclusive collabs"
          title="No Applications yet"
          action={() => router.push("/collaborations")}
          actionLabel="Explore Collaborations"
        />
      ) : pendingProposals.length !== 0 ? (
        <FlatList
          data={pendingProposals}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: "100%",
                borderWidth: 0.3,
                borderColor: Colors(theme).gray300,
                gap: 8,
                borderRadius: 5,
                overflow: "hidden",
                paddingBottom: 16,
              }}
            >
              <CollaborationHeader
                cardId={item.id}
                cardType="collaboration"
                brand={{
                  image: item.brandImage,
                  name: item.brandName,
                  paymentVerified: item.paymentVerified,
                }}
                collaboration={{
                  collabId: item.id,
                  collabName: item.name,
                  timePosted: item.timeStamp,
                }}
                onOpenBottomSheet={() => openBottomSheet(item.id)}
              />
              <ScrollMedia
                theme={theme}
                xl={xl} media={item.applications[index].attachments.map(
                  (attachment: MediaItem) => processRawAttachment(attachment)
                ) || []} MAX_WIDTH_WEB={MAX_WIDTH_WEB} />

              {/* <Carousel
                theme={theme}
                data={
                  item.applications[index].attachments.map(
                    (attachment: MediaItem) => processRawAttachment(attachment)
                  ) || []
                }
                carouselWidth={MAX_WIDTH_WEB}
              /> */}
              <Pressable
                onPress={() => {
                  router.push({
                    // @ts-ignore
                    pathname: `/collaboration-details/${item.id}`,
                    params: {
                      cardType: "collaboration",
                      cardId: item.id,
                      collaborationID: item.id,
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
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              {notPendingProposals !== 0 && (
                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        marginBottom: 10,
                        color: Colors(theme).text,
                      },
                    ]}
                  >
                    Looking for past applications
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors(theme).card,
                      padding: 10,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href={{
                        pathname: "/past/application",
                      }}
                      style={{}}
                    >
                      <Text>View Past Applications</Text>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          }
          contentContainerStyle={{
            paddingTop: 8,
            gap: 16,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors(theme).primary]} // Customize color based on theme
            />
          }
        />
      ) : (
        //@ts-ignore
        <>
          {pendingProposals.length === 0 && notPendingProposals !== 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    marginBottom: 10,
                    color: Colors(theme).text,
                  },
                ]}
              >
                Looking for past applications
              </Text>
              <View
                style={{
                  backgroundColor: Colors(theme).card,
                  padding: 10,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link href={"/past/application"} style={{}}>
                  <Text>View Past Applications</Text>
                </Link>
              </View>
            </View>
          )}
        </>
      )}
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="proposal"
          isVisible={isVisible}
          onClose={closeBottomSheet}
          snapPointsRange={["20%", "50%"]}
          key={selectedCollabId}
        />
      )}
    </View>
  );
};

export default Applications;
