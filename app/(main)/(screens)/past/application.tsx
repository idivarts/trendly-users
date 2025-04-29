import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/card-components/CollaborationDetails";
import CollaborationHeader from "@/components/collaboration/card-components/CollaborationHeader";
import { MediaItem } from "@/components/collaboration/render-media-item";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import ScrollMedia from "@/shared-uis/components/carousel/scroll-media";
import { processRawAttachment } from "@/utils/attachments";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import {
  collection,
  collectionGroup,
  doc as firebaseDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
;

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
  const { xl } = useBreakpoints();

  const fetchProposals = async () => {
    try {
      const applicationCol = collectionGroup(FirestoreDB, "applications");
      const querySnap = query(
        applicationCol,
        where("userId", "==", user?.id),
        where("status", "!=", "pending")
      );
      const applicationSnapshot = await getDocs(querySnap);
      const applicationData = applicationSnapshot.docs.map((doc) => ({
        id: doc.id,
        status: doc.data().status,
        collaborationId: doc.data().collaborationId,
        ...doc.data(),
      }));

      let totalNotPendingApplications = 0;

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

      const validProposals = applicationWithCollab.filter((proposal: any) => {
        if (proposal === null) {
          return false;
        }

        return (
          proposal !== null ||
          proposal.applications.status === "accepted" ||
          proposal.applications.status === "rejected"
        );
      });

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
    <AppLayout withWebPadding>
      <ScreenHeader title="Past Applications" />
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={proposals}
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
                xl={xl}
                MAX_WIDTH_WEB={MAX_WIDTH_WEB}
                media={
                  (item.applications[index].attachments &&
                    item.applications[index].attachments.map(
                      (attachment: MediaItem) =>
                        processRawAttachment(attachment)
                    )) ||
                  []
                }
              />
              {/* <Carousel
                theme={theme}
                data={
                  (item.applications[index].attachments &&
                    item.applications[index].attachments.map(
                      (attachment: MediaItem) =>
                        processRawAttachment(attachment)
                    )) ||
                  []
                }
              /> */}
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
