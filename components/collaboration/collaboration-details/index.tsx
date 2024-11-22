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

interface Collaboration extends ICollaboration {
  brandName: string;
  paymentVerified: boolean;
  brandDescription: string;
}

interface CollaborationDetailsProps {
  pageID: string;
  cardType: string;
  collaborationID: string;
  cardId: string;
}

const CollaborationDetails: React.FC<CollaborationDetailsProps> = ({
  pageID,
  cardType,
  collaborationID,
  cardId,
}) => {
  const [collaboration, setCollaboration] = useState<Collaboration | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>();

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
      cardType={cardType as string}
      collaborationDetail={collaboration}
      invitationData={invitation}
      pageID={pageID as string}
    />
  );
};

export default CollaborationDetails;

