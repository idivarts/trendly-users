import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { FirestoreDB } from "@/utils/firestore";
import CollaborationDetailsContent from "./CollaborationDetailsContent";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { View } from "@/components/theme/Themed";
import { Invitation } from "@/types/Collaboration";

export interface CollaborationDetail extends ICollaboration {
  brandDescription: string;
  brandName: string;
  paymentVerified: boolean;
}

interface CollaborationDetailsProps {
  cardId: string;
  cardType: string; // "collaboration" | "invitation"
  collaborationID: string;
  pageID: string;
}

const CollaborationDetails: React.FC<CollaborationDetailsProps> = ({
  cardId,
  cardType,
  collaborationID,
  pageID,
}) => {
  const [collaboration, setCollaboration] = useState<CollaborationDetail | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<Invitation>();

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
        brandDescription: brandData?.description || "",
        brandName: brandData?.name || "Unknown Brand",
        paymentVerified: brandData?.paymentMethodVerified || false,
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
        FirestoreDB,
        "collaborations",
        collaborationID,
        "invitations",
        cardId
      );
      const invitationSnapshot = await getDoc(invitationRef);
      setInvitation({
        id: invitationSnapshot.id,
        ...invitationSnapshot.data(),
      } as Invitation);
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!collaboration) return null;

  return (
    <CollaborationDetailsContent
      cardType={cardType}
      collaborationDetail={collaboration}
      invitationData={invitation}
      pageID={pageID}
    />
  );
};

export default CollaborationDetails;
