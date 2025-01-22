import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import AppLayout from "@/layouts/app-layout";
import {
  collection,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
  collectionGroup,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { getDocs } from "firebase/firestore";
import BottomSheetActions from "@/components/BottomSheetActions";
import ScreenHeader from "@/components/ui/screen-header";
import CollaborationDetails from "@/components/collaboration/card-components/CollaborationDetails";
import Colors from "@/constants/Colors";
import { processRawAttachment } from "@/utils/attachments";
import Carousel from "@/shared-uis/components/carousel/carousel";
import CollaborationHeader from "@/components/collaboration/card-components/CollaborationHeader";
import { useTheme } from "@react-navigation/native";
import { useAuthContext } from "@/contexts";

const PastApplicationPage = (props: any) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [proposals, setProposals] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCollabId, setSelectedCollabId] = React.useState<string | null>(
    null
  );
  const theme = useTheme();
  const { user } = useAuthContext();
  const openBottomSheet = (id: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const fetchInvitations = async () => {
    try {
      const invitationCol = collectionGroup(FirestoreDB, "invitations");
      const querySnap = query(invitationCol, where("userId", "==", user?.id));
      const invitationSnapshot = await getDocs(querySnap);
      const invitationData = invitationSnapshot.docs.map((doc) => ({
        id: doc.id,
        status: doc.data().status,
        collaborationId: doc.data().collaborationId,
        ...doc.data(),
      }));

      let totalNotPendingApplications = 0;

      const applicationWithCollab = await Promise.all(
        invitationData.map(async (application) => {
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
            applications: application,
          };
        })
      );

      const validProposals = applicationWithCollab.filter((proposal: any) => {
        return (
          proposal !== null ||
          (proposal && proposal?.applications.status !== "pending")
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
    fetchInvitations();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader title="Past Invitations" />
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
                paddingBottom: 16,
                overflow: "hidden",
              }}
            >
              <CollaborationHeader
                cardId={item.id}
                cardType="invitation"
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
              {item.attachments && item.attachments.length > 0 && (
                <Carousel
                  theme={theme}
                  data={
                    item.attachments?.map((attachment: any) =>
                      processRawAttachment(attachment)
                    ) || []
                  }
                />
              )}
              <CollaborationDetails
                collaborationDetails={{
                  collabDescription: item.description || "",
                  promotionType: item.promotionType,
                  location: item.location,
                  platform: item.platform,
                  contentType: item.contentFormat,
                }}
              />
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
