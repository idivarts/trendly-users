import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { FirestoreDB } from "@/utils/firestore";
import CollaborationDetailsContent from "./CollaborationDetailsContent";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { View } from "@/components/theme/Themed";
import { Invitation } from "@/types/Collaboration";
import { useAuthContext } from "@/contexts";

export interface CollaborationDetail extends ICollaboration {
  brandDescription: string;
  brandName: string;
  paymentVerified: boolean;
  brandImage: string;
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
  const [collaboration, setCollaboration] = useState<
    CollaborationDetail | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [totalApplications, setTotalApplications] = useState(0);
  const [application, setApplication] = useState<IApplications>();
  const [cardTypeDetails, setCardTypeDetails] = useState<string>(cardType);
  const [invitation, setInvitation] = useState<Invitation>();
  const { user } = useAuthContext();

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

      const applicationsRef = collection(collabRef, "applications");
      const applicationsSnapshot = await getDocs(applicationsRef);
      const applicationsData = applicationsSnapshot.docs.map((doc) =>
        doc.data()
      );
      setTotalApplications(applicationsData.length);

      if (!user || !user.id) return;

      const hasApplied = collectionGroup(FirestoreDB, "applications");
      if (!user || !user.id) return;

      const hasAppliedQuery = query(
        hasApplied,
        where("userId", "==", user?.id),
        where("collaborationId", "==", pageID)
      );

      // Use getDocs for queries, not getDoc
      const hasAppliedSnapshot = await getDocs(hasAppliedQuery);
      const hasAppliedData = hasAppliedSnapshot.docs.map((doc) => doc.data());

      setHasApplied(hasAppliedData.length > 0);
      setApplication(hasAppliedData[0] as IApplications);

      if (hasAppliedData.length > 0) {
        setCardTypeDetails("application");
      }

      setCollaboration({
        ...data,
        brandDescription: brandData?.description || "",
        brandName: brandData?.name || "Unknown Brand",
        brandImage: brandData?.image || "",
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
    );
  }

  if (!collaboration) return null;

  return (
    <CollaborationDetailsContent
      cardType={cardTypeDetails}
      applicationData={application}
      collaborationDetail={collaboration}
      invitationData={invitation}
      totalApplications={totalApplications}
      pageID={pageID}
    />
  );
};

export default CollaborationDetails;
