import React, { useEffect } from "react";
import { View, FlatList, Pressable } from "react-native";
import AppLayout from "@/layouts/app-layout";
import JobCard from "@/components/collaboration/CollaborationCard";
import {
  collection,
  getDoc,
  query,
  where,
  getDocs,
  doc as firebaseDoc,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import BottomSheetActions from "@/components/BottomSheetActions";
import ScreenHeader from "@/components/ui/screen-header";
import CollaborationDetails from "@/components/collaboration/card-components/CollaborationDetails";
import Colors from "@/constants/Colors";
import { processRawAttachment } from "@/utils/attachments";
import Carousel from "@/shared-uis/components/carousel/carousel";
import CollaborationHeader from "@/components/collaboration/card-components/CollaborationHeader";
import { Card } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useAuthContext } from "@/contexts";
import { MediaItem } from "@/components/ui/carousel/render-media-item";
import { router } from "expo-router";

const PastApplicationPage = (props: any) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [proposals, setProposals] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCollabId, setSelectedCollabId] = React.useState<string | null>(
    null
  );
  const theme = useTheme();
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const { user } = useAuthContext();

  const fetchProposals = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);

      // Map over the collaborations to fetch applications for each collaboration
      const proposalsWithApplications = await Promise.all(
        collabSnapshot.docs.map(async (doc) => {
          const collab = {
            id: doc.id,
            brandId: doc.data().brandId,
            ...doc.data(),
          };
          const brandDoc = firebaseDoc(
            collection(FirestoreDB, "brands"),
            collab.brandId
          );
          const brandData = await getDoc(brandDoc);
          if (!brandData.exists()) {
            return null;
          }

          // Fetch applications for the current collaboration
          const applicationCol = collection(
            FirestoreDB,
            "collaborations",
            collab.id,
            "applications"
          );

          const applicationSnapshot = query(
            applicationCol,
            where("userId", "==", user?.id),
            where("status", "in", ["accepted", "rejected"])
          );

          const applicationData = await getDocs(applicationSnapshot).then(
            (querySnapshot) => {
              return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                userId: doc.data().userId,
                status: doc.data().status,
                ...doc.data(),
              }));
            }
          );

          if (applicationData.length === 0) {
            return null;
          }

          return {
            ...collab,
            applications: applicationData[0],
            brandName: brandData.data().name,
            brandImage: brandData.data().image,
          };
        })
      );

      const validProposals = proposalsWithApplications.filter(
        (proposal: any) => {
          if (proposal === null) {
            return false;
          }
          return (
            proposal !== null ||
            proposal.applications.status === "accepted" ||
            proposal.applications.status === "rejected"
          );
        }
      );

      setProposals(validProposals);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader title="Past Applications" />
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={proposals}
          renderItem={({ item }) => (
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
              <Carousel
                theme={theme}
                data={
                  item.applications.attachments.map((attachment: MediaItem) =>
                    processRawAttachment(attachment)
                  ) || []
                }
              />
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
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
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
    </AppLayout>
  );
};

export default PastApplicationPage;
