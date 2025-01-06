import BottomSheetActions from "@/components/BottomSheetActions";
import JobCard from "@/components/collaboration/CollaborationCard";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc as firebaseDoc,
  getDoc,
} from "firebase/firestore";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { stylesFn } from "@/styles/Proposal.styles";
import EmptyState from "../ui/empty-state";
import CollaborationDetails from "../collaboration/card-components/CollaborationDetails";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { processRawAttachment } from "@/utils/attachments";
import CollaborationHeader from "../collaboration/card-components/CollaborationHeader";
import { Card } from "react-native-paper";
import { useAuthContext } from "@/contexts";

const Invitations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [invitationID, setInvitationID] = useState<string>();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [notPendingInvitations, setNotPendingInvitations] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthContext();

  const openBottomSheet = (id: string, invitation: string) => {
    setIsVisible(true);
    setSelectedCollabId(id);
    setInvitationID(invitation);
  };
  const closeBottomSheet = () => setIsVisible(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const [isLoading, setIsLoading] = useState(true);
  const fetchInvitations = async () => {
    try {
      const collaborationCol = collection(FirestoreDB, "collaborations");
      const collabSnapshot = await getDocs(collaborationCol);
      let totalNotPendingInvitations = 0;

      // Map over the collaborations to fetch applications for each collaboration
      const invitationsWithApplications = await Promise.all(
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
            "invitations"
          );
          const applicationSnapshot = query(
            applicationCol,
            where("userId", "==", user?.id)
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

          const userApplications = applicationData.filter(
            (application) => application.userId === user?.id
          );

          const notPendingApplications = userApplications.filter(
            (application) => application.status !== "pending"
          ).length;

          totalNotPendingInvitations += notPendingApplications;

          if (applicationData.length === 0) {
            return null;
          }

          return {
            ...collab,
            applications: applicationData[0],
            brandName: brandData.data().name,
          };
        })
      );

      const validProposals = invitationsWithApplications.filter(
        (proposal) => proposal !== null
      );

      setInvitations(validProposals);
      setNotPendingInvitations(totalNotPendingInvitations);
    } catch (error) {
      console.error("Error fetching proposals: ", error);
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

  const pendingInvitations = useMemo(
    () =>
      invitations.filter((invitation) => {
        return invitation.applications.status === "pending";
      }),
    [invitations]
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
        width: "100%",
        flex: 1,
      }}
    >
      {pendingInvitations.length === 0 && notPendingInvitations === 0 ? (
        <EmptyState
          hideAction
          image={require("@/assets/images/illustration5.png")}
          subtitle="Start building your profile today to have better reach. If any brand invites you to collaborate we would show it here"
          title="No Invitations yet"
        />
      ) : pendingInvitations.length !== 0 ? (
        <FlatList
          data={pendingInvitations}
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
                onOpenBottomSheet={() =>
                  openBottomSheet(item.id, item.applications.id)
                }
              />
              {item.attachments && item.attachments.length > 0 && (
                <Carousel
                  theme={theme}
                  data={
                    user?.profile?.attachments?.map((attachment) =>
                      processRawAttachment(attachment)
                    ) || []
                  }
                  dot={
                    <View
                      style={{
                        backgroundColor: Colors(theme).primary,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                      }}
                    />
                  }
                  activeDot={
                    <View
                      style={{
                        backgroundColor: Colors(theme).gray100,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                      }}
                    />
                  }
                />
              )}
              <Pressable
                onPress={() => {
                  router.push({
                    // @ts-ignore
                    pathname: `/collaboration-details/${item.id}`,
                    params: {
                      cardType: "invitation",
                      cardId: item.applications.id,
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
              {notPendingInvitations !== 0 && (
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
                    Looking for past invitations
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
                    <Link href={"/past/invitation"} style={{}}>
                      <Text>View Past Invitations</Text>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          }
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
        />
      ) : (
        <View>
          {pendingInvitations.length === 0 && notPendingInvitations !== 0 && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
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
                Looking for past invitations
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
                <Link href={"/past/invitation"} style={{}}>
                  <Text>View Past Invitations</Text>
                </Link>
              </View>
            </View>
          )}
        </View>
      )}
      {isVisible && (
        <BottomSheetActions
          cardId={selectedCollabId || ""}
          cardType="proposal"
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

export default Invitations;
