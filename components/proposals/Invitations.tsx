import BottomSheetActions from "@/components/BottomSheetActions";
import { Text, View } from "@/components/theme/Themed";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { IOScroll } from "@/shared-libs/contexts/scroll-context";
import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Carousel from "@/shared-uis/components/carousel/carousel";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Proposal.styles";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import {
  collection,
  collectionGroup,
  doc as firebaseDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import CollaborationDetails from "../collaboration/card-components/CollaborationDetails";
import CollaborationHeader from "../collaboration/card-components/CollaborationHeader";
import EmptyState from "../ui/empty-state";
;

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
  const { xl } = useBreakpoints();
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

      const validProposals = applicationWithCollab.filter((proposal) => {
        return proposal !== null;
      });

      setInvitations(validProposals);
      setNotPendingInvitations(totalNotPendingApplications);
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
        flex: 1,
        width: xl ? MAX_WIDTH_WEB : "100%",
        marginHorizontal: "auto",
      }}
    >
      {pendingInvitations.length === 0 && notPendingInvitations === 0 ? (
        <EmptyState
          hideAction
          image={require("@/assets/images/illustration5.png")}
          subtitle="Start building your profile today to have better reach. If any brand invites you to collaborate we would show it here"
          title="No Invitations yet"
        />
      ) : (
        <IOScroll>
          {pendingInvitations.length !== 0 &&
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
                        item.attachments?.map((attachment: Attachment) =>
                          processRawAttachment(attachment)
                        ) || []
                      }
                      carouselWidth={MAX_WIDTH_WEB}
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
            />}
          {notPendingInvitations != 0 && (
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

export default Invitations;
