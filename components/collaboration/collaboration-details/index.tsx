import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  collection,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";

import { View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import {
  ICollaboration
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Invitation } from "@/types/Collaboration";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { useIsFocused } from "@react-navigation/native";
import { IOScrollView } from "react-native-intersection-observer";
import CollaborationDetailsContent from "./CollaborationDetailsContent";

export interface CollaborationDetail extends ICollaboration {
  id: string;
  brandDescription: string;
  brandName: string;
  paymentVerified: boolean;
  brandWebsite: string;
  brandCategory: string[];
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
  const [application, setApplication] = useState<any>();
  const [cardTypeDetails, setCardTypeDetails] = useState<string>(cardType);
  const [invitation, setInvitation] = useState<Invitation>();
  const { user } = useAuthContext();
  const isFocused = useIsFocused();

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
      const brandData = brandSnapshot.data() as IBrands;

      const applicationsRef = collection(collabRef, "applications");
      const applicationsCount = (await getDocs(applicationsRef)).size;

      setTotalApplications(applicationsCount);

      if (user) {
        // const hasApplied = collectionGroup(FirestoreDB, "applications");
        const docRef = doc(collection(FirestoreDB, "collaborations", pageID, "applications"), AuthApp.currentUser?.uid);
        const applicationDoc = await getDoc(docRef);
        const hasAppliedBool = applicationDoc.exists();
        const hasAppliedData = {
          id: applicationDoc.id,
          ...applicationDoc.data()
        }

        setHasApplied(hasAppliedBool);
        setApplication(hasAppliedData);

        if (hasAppliedBool && cardType !== "invitation") {
          setCardTypeDetails("application");
        }
      }

      setCollaboration({
        id: snapshot.id,
        ...data,
        brandDescription: brandData?.profile
          ? brandData?.profile?.about || ""
          : "",
        brandName: brandData?.name || "Unknown Brand",
        brandImage: brandData?.image || "",
        paymentVerified: brandData?.paymentMethodVerified || false,
        brandWebsite: brandData?.profile
          ? brandData?.profile?.website || ""
          : "",
        brandCategory: brandData?.profile
          ? brandData?.profile.industries || []
          : [],
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
  }, [pageID, isFocused]);

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
    <IOScrollView>
      <CollaborationDetailsContent
        cardType={cardTypeDetails}
        applicationData={application}
        collaborationDetail={collaboration}
        invitationData={invitation}
        totalApplications={totalApplications}
        fetchCollaboration={fetchCollaboration}
        pageID={pageID}
      />
    </IOScrollView>
  );
};

export default CollaborationDetails;
