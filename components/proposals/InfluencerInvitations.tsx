import BottomSheetActions from "@/components/BottomSheetActions";
import { View } from "@/components/theme/Themed";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { IOScroll } from "@/shared-libs/contexts/scroll-context";
import { InfluencerInvite } from "@/shared-libs/firestore/trendly-pro/models/influencerInvites";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import InfluencerCard from "@/shared-uis/components/InfluencerCard";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Proposal.styles";
import { User } from "@/types/User";
import { useTheme } from "@react-navigation/native";
import {
  collection,
  doc as firebaseDoc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl
} from "react-native";
import EmptyState from "../ui/empty-state";
;

type InvitationType = (InfluencerInvite & {
  influencer?: User;
  social?: ISocials;
})
const InfluencerInvitations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [invitationID, setInvitationID] = useState<string>();
  const [invitations, setInvitations] = useState<InvitationType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthContext();
  const router = useMyNavigation()

  const openBottomSheet = (id: string, invitation: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
    setInvitationID(invitation);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const [isLoading, setIsLoading] = useState(true);
  const { xl } = useBreakpoints();
  const fetchInvitations = async () => {
    try {
      const invitationCol = collection(FirestoreDB, "users", (user?.id || ""), "invitations");
      const querySnap = query(invitationCol, where("status", "==", 0));
      const invitationSnapshot = await getDocs(querySnap);
      const invitationData = invitationSnapshot.docs.map((doc) => {
        const data = doc.data() as InfluencerInvite
        return data
      });

      let totalNotPendingApplications = 0;

      const invitationsWithInfluencers = await Promise.all(
        invitationData.map(async (invite) => {
          const userDoc = firebaseDoc(
            collection(FirestoreDB, "users"),
            invite.influencerId
          );
          const userData = await getDoc(userDoc);
          if (!userData.exists()) {
            return null;
          }
          const user: User = {
            id: userData.id,
            ...userData.data() as IUsers,
          }

          const socialDoc = firebaseDoc(
            collection(FirestoreDB, "users", user.id, "socials"),
            user.primarySocial
          );
          const socialData = await getDoc(socialDoc);
          if (!socialData.exists()) {
            return null;
          }
          const social = socialData.data() as ISocials;

          return {
            ...invite,
            influencer: user,
            social: social
          } as InvitationType;
        })
      );

      setInvitations(invitationsWithInfluencers.filter((invite) => invite !== null));
    } catch (error) {
      Console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvitations();
    setRefreshing(false);
  };

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
      {invitations.length === 0 ? (
        <EmptyState
          hideAction
          image={require("@/assets/images/illustration5.png")}
          subtitle="Start building your profile today to have better reach. If any brand invites you to collaborate we would show it here"
          title="No Invitations yet"
        />
      ) : (
        <IOScroll>
          {invitations.length !== 0 &&
            <FlatList
              data={invitations}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "100%",
                    padding: 16,
                  }}
                >
                  <InfluencerCard
                    influencer={item.influencer as User}
                    type="explore"
                    customAttachments={[]}
                    customText={item.reason}
                    customTaxonomies={[...(item.collabType || []), (item.collabMode == "free" ? "Free" : "Paid"), ...(item.collabMode == "paid" ? ["Budget : " + item.budgetMin + " - " + item.budgetMax] : [])]}
                    openProfile={(influencer) => {
                      router.push({
                        pathname: "/review-influencer",
                        params: {
                          influencerId: influencer.id,
                        },
                      })
                    }}
                  />
                </View>
              )}
              keyExtractor={(item, index) => item.influencerId}

              contentContainerStyle={{
                padding: 16,
                paddingTop: 8,
                gap: 16,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Colors(theme).primary]} // Customize color based on theme
                />
              }
            />}
        </IOScroll>
      )}
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="invitation"
          invitationId={invitationID}
          isVisible={isVisible}
          onClose={closeBottomSheet}
          snapPointsRange={["20%", "50%"]}
          key={selectedCollabId}
        />
      )}

    </View>
  );
};

export default InfluencerInvitations;
