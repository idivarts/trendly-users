import CollaborationPage from "@/components/collaboration/CollaborationDetails";
import { useEffect, useState } from "react";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { FirestoreDB } from "@/utils/firestore";
import AppLayout from "@/layouts/app-layout";
import { ActivityIndicator } from "react-native-paper";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { AuthApp } from "@/utils/auth";

interface Collaboration extends ICollaboration {
  brandName: string;
  paymentVerified: boolean;
  brandDescription: string;
}

const CollaborationDetailsScreen = () => {
  const { pageID, cardType, collaborationID, cardId } = useLocalSearchParams();
  const [collaboration, setCollaboration] = useState<Collaboration | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>();
  const [application, setApplication] = useState();

  // Fetch Collaboration Data
  const fetchCollaboration = async () => {
    if (!pageID) return;
    try {
      const collabRef = doc(FirestoreDB, "collaborations", pageID as string);
      const snapshot = await getDoc(collabRef);
      const data = snapshot.data() as ICollaboration;
      if (!data) return;

      const brandRef = doc(FirestoreDB, "brands", data.brandId);
      const brandSnapshot = await getDoc(brandRef);
      const brandData = brandSnapshot.data();

      setCollaboration({
        ...data,
        brandName: brandData?.name || "Unknown Brand",
        paymentVerified: brandData?.paymentMethodVerified || false,
        brandDescription: brandData?.description || "",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Specific Invitation Data
  const fetchSpecificInvitation = async () => {
    if (!collaborationID || !cardId) return;
    try {
      const invitationRef = doc(
        // @ts-ignore
        FirestoreDB,
        "collaborations",
        collaborationID,
        "invitations",
        cardId
      );
      const invitationSnapshot = await getDoc(invitationRef);
      const invitationData = {
        id: invitationSnapshot.id,
        ...invitationSnapshot.data(),
      };
      setInvitation(invitationData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, [pageID]);

  useEffect(() => {
    if (cardType === "invitation") {
      fetchSpecificInvitation();
    }
  }, [cardType, collaborationID, cardId]);

  if (loading)
    return (
      <AppLayout>
        <ActivityIndicator />
      </AppLayout>
    );

  if (!collaboration) return null;

  return (
    <CollaborationPage
      collaborationDetail={collaboration}
      pageID={pageID}
      cardType={cardType}
      invitationData={invitation} // Pass invitation data if needed
    />
  );
};

export default CollaborationDetailsScreen;
