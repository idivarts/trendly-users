import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, Pressable, Linking } from "react-native";
import { Text, Card, Paragraph, Button, Portal } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import { FirestoreDB } from "@/utils/firestore";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import {
  useAuthContext,
  useChatContext,
  useNotificationContext,
} from "@/contexts";
import { CollaborationDetail } from ".";
import { Invitation } from "@/types/Collaboration";
import {
  faCheckCircle,
  faCoins,
  faDollar,
  faMap,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { processRawAttachment } from "@/utils/attachments";
import { formatDistanceToNow } from "date-fns";
import { truncateText } from "@/utils/profile";
import ChipCard from "../card-components/ChipComponent";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import CreateCollaborationMap from "@/components/create-collaboration/CreateCollaborationMap";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { PLACEHOLDER_IMAGE } from "@/constants/PlaceholderImage";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import UserResponse from "../UserResponse";
import BrandModal from "./modal/BrandModal";
import ManagerModal from "./modal/ManagerModal";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { imageUrl } from "@/utils/url";

interface ApplicationData extends IApplications {
  id: string;
}

interface CollaborationDetailsContentProps {
  pageID: string;
  cardType: string; // "collaboration" | "invitation" | "application"
  collaborationDetail: CollaborationDetail;
  logo?: string;
  totalApplications: number;
  fetchCollaboration: () => void;
  applicationData?: ApplicationData;
  invitationData?: Invitation;
}

const CollborationDetailsContent = (
  props: CollaborationDetailsContentProps
) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [status, setStatus] = React.useState("pending");
  const [managerDetails, setManagerDetails] = React.useState<any>();
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [managerModalVisible, setManagerModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [cardType, setCardType] = useState(props.cardType);

  const { createNotification } = useNotificationContext();
  const { user } = useAuthContext();

  const { createGroupWithMembers, connectUser } = useChatContext();

  const fetchManagerDetails = async () => {
    const managerRef = doc(
      FirestoreDB,
      "managers",
      props.collaborationDetail.managerId
    );
    const managerDoc = await getDoc(managerRef);

    const managerBrandref = doc(
      FirestoreDB,
      "brands",
      props.collaborationDetail.brandId,
      "members",
      props.collaborationDetail.managerId
    );

    const managerBrandDoc = await getDoc(managerBrandref);

    const managerData = managerDoc.data() as IManagers;
    const managerBrandData = managerBrandDoc.data();

    setManagerDetails({
      name: managerData.name,
      email: managerData.email,
      profileImage: managerData.profileImage,
      role: managerBrandData?.role,
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            size={16}
            color={Colors(theme).yellow}
          />
        ))}
        {hasHalfStar && (
          <FontAwesomeIcon
            icon={faStarHalfStroke}
            size={16}
            color={Colors(theme).yellow}
          />
        )}
      </>
    );
  };

  const acceptInvitation = async () => {
    if (!props.invitationData) return;

    const invitationRef = doc(
      FirestoreDB,
      "collaborations",
      props.invitationData.collaborationId,
      "invitations",
      props.invitationData.id
    );

    await updateDoc(invitationRef, {
      status: "accepted",
    }).then(() => {
      if (!user?.id) return;

      createGroupWithMembers(props.collaborationDetail.name, [user?.id]).then(
        (channel) => {
          connectUser();

          createNotification(
            props?.invitationData?.managerId || "",
            {
              data: {
                userId: user?.id,
                collaborationId: props.invitationData?.collaborationId,
              },
              description: `${user?.name} with email id ${user?.email} accepted invitation to collaborate for ${props.collaborationDetail.name}`,
              isRead: false,
              timeStamp: Date.now(),
              title: "Invitation Accepted",
              type: "invitation-accepted",
            },
            "managers"
          );

          setStatus("accepted");
          Toaster.success("Invitation accepted successfully");

          router.navigate(`/channel/${channel.cid}`);
        }
      );
    });
  };

  const rejectInvitation = () => {
    if (!props.invitationData) return;

    const invitationRef = doc(
      FirestoreDB,
      "collaborations",
      props.invitationData.collaborationId,
      "invitations",
      props.invitationData.id
    );
    const updation = updateDoc(invitationRef, {
      status: "rejected",
    });
    Toaster.success("Invitation Rejected");
    props.invitationData = {
      ...props.invitationData,
      status: "rejected",
    };
    setStatus("rejected");
  };

  const withdrawApplication = () => {
    try {
      if (!props.applicationData) return;
      const applicationRef = doc(
        FirestoreDB,
        "collaborations",
        props.pageID,
        "applications",
        props?.applicationData?.id
      );
      deleteDoc(applicationRef);

      Toaster.success("Application Withdrawn Successfully");
      setCardType("collaboration");
      props.fetchCollaboration();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchManagerDetails();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Collaboration Details */}
      <View style={styles.profileCard}>
        {props?.collaborationDetail?.attachments &&
          props?.collaborationDetail?.attachments.length > 0 && (
            <Carousel
              theme={theme}
              data={
                props?.collaborationDetail?.attachments?.map((attachment) =>
                  processRawAttachment(attachment)
                ) || []
              }
            />
          )}
        <Card.Content style={styles.profileContent}>
          {/* About Collaboration */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text variant="headlineMedium" style={styles.name}>
                {props.collaborationDetail.name}
              </Text>
              {props.collaborationDetail.timeStamp ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors(theme).text,
                    paddingRight: 8,
                  }}
                >
                  {formatDistanceToNow(props.collaborationDetail.timeStamp, {
                    addSuffix: true,
                  })}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: "100%",
              }}
            >
              <Text variant="bodySmall" style={styles.shortDescription}>
                {props.collaborationDetail.description}
              </Text>
            </View>
          </View>

          {/* Brand Information */}

          <View
            style={{
              width: "100%",
              borderWidth: 0.3,
              paddingVertical: 16,
              borderRadius: 10,
              borderColor: Colors(theme).gray300,
            }}
          >
            <Card.Content>
              <Pressable
                style={{ flex: 1, flexDirection: "column", gap: 16 }}
                onPress={() => setBrandModalVisible(true)}
              >
                <View style={{ flexDirection: "row" }}>{renderStars(4.5)}</View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexGrow: 1,
                  }}
                >
                  <Image
                    source={imageUrl(props.collaborationDetail.brandImage)}
                    style={{ width: 40, height: 40, borderRadius: 5 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: Colors(theme).text,
                      }}
                    >
                      {props.collaborationDetail.brandName}{" "}
                      {props.collaborationDetail.paymentVerified && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color={Colors(theme).primary}
                        />
                      )}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        flexWrap: "wrap",
                        overflow: "hidden",
                        lineHeight: 22,
                        color: Colors(theme).text,
                      }}
                    >
                      {truncateText(
                        props.collaborationDetail.brandDescription,
                        120
                      )}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Card.Content>
          </View>

          {cardType === "collaboration" && (
            <Button
              mode="contained"
              style={{
                width: "100%",
              }}
              onPress={() => {
                router.push(`/apply-now/${props.pageID}`);
              }}
            >
              Apply Now
            </Button>
          )}
          {cardType === "invitation" &&
            props.invitationData?.status === "pending" &&
            status === "pending" && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <Button
                  mode="contained"
                  style={styles.applyButton}
                  onPress={() => {
                    acceptInvitation();
                  }}
                >
                  Accept
                </Button>
                <Button
                  mode="contained"
                  style={styles.applyButton}
                  onPress={() => {
                    rejectInvitation();
                  }}
                >
                  Reject
                </Button>
              </View>
            )}
          {cardType === "application" && (
            <UserResponse
              application={props.applicationData}
              influencerQuestions={
                props?.collaborationDetail?.questionsToInfluencers
              }
              setConfirmationModalVisible={setConfirmationModalVisible}
            />
          )}

          {props.collaborationDetail?.externalLinks &&
            props.collaborationDetail?.externalLinks.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                  justifyContent: "space-between",
                }}
              >
                {props.collaborationDetail?.externalLinks?.map(
                  (item, index) => (
                    <Button
                      key={index}
                      mode="contained"
                      style={{
                        flexBasis: 1,
                        flexGrow: 1,
                      }}
                      onPress={() => {
                        Linking.openURL(item.link);
                      }}
                    >
                      {item.name}
                    </Button>
                  )
                )}
              </View>
            )}

          {/* Statistics */}

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 8,
              borderWidth: 0.3,
              borderRadius: 10,
              borderColor: Colors(theme).gray300,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors(theme).text,
              }}
            >
              Influencer Needed:{" "}
              {props.collaborationDetail.numberOfInfluencersNeeded}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors(theme).text,
              }}
            >
              Influencer Applied: {props.totalApplications}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors(theme).text,
              }}
            >
              Brand Hire Rate: 75%
            </Text>
            {props.collaborationDetail.promotionType ===
              PromotionType.PAID_COLLAB && (
              <Text
                style={{
                  fontSize: 16,
                  color: Colors(theme).text,
                }}
              >
                Budget:
                {props.collaborationDetail?.budget?.min ===
                props.collaborationDetail?.budget?.max
                  ? `$${props.collaborationDetail?.budget?.min}`
                  : `$${props.collaborationDetail?.budget?.min} - $${props.collaborationDetail?.budget?.max}`}
              </Text>
            )}
          </View>
          {/* chips */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <ChipCard
              chipText={
                props.collaborationDetail.promotionType ===
                PromotionType.PAID_COLLAB
                  ? "Paid"
                  : "Unpaid"
              }
              chipIcon={faDollar}
            />
            <ChipCard
              chipText={props.collaborationDetail.location.type}
              chipIcon={faMap}
            />
            <ChipCard
              chipText={
                props.collaborationDetail.platform.length > 1
                  ? props.collaborationDetail.platform[0] +
                    "+" +
                    (props.collaborationDetail.platform.length - 1)
                  : props.collaborationDetail.platform[0]
              }
              chipIcon={
                props.collaborationDetail.platform[0] === "Instagram"
                  ? faInstagram
                  : props.collaborationDetail.platform[0] === "Facebook"
                  ? faFacebook
                  : props.collaborationDetail.platform[0] === "Youtube"
                  ? faYoutube
                  : faInstagram
              }
            />
          </View>
          {props.collaborationDetail.contentFormat &&
            props.collaborationDetail.contentFormat.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {props.collaborationDetail.contentFormat.map(
                  (content, index) => (
                    <ChipCard
                      key={index}
                      chipText={content}
                      chipIcon={faCoins}
                    />
                  )
                )}
              </View>
            )}
          {props.collaborationDetail.location.type === "Physical" && (
            <View
              style={{
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors(theme).text,
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                Location
              </Text>
              <CreateCollaborationMap
                mapRegion={{
                  latitude: props.collaborationDetail?.location?.latlong?.lat,
                  longitude: props.collaborationDetail?.location?.latlong?.long,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.042,
                }}
                onMapRegionChange={(region) => {}}
                onFormattedAddressChange={(address) => {}}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Colors(theme).text,
                  lineHeight: 24,
                }}
              >
                {props.collaborationDetail.location.name}
              </Text>
            </View>
          )}
          {props?.collaborationDetail?.questionsToInfluencers &&
            props?.collaborationDetail?.questionsToInfluencers.length > 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 8,
                  borderWidth: 0.3,
                  borderColor: Colors(theme).gray300,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors(theme).text,
                    fontWeight: "bold",
                  }}
                >
                  Questions asked on application
                </Text>

                {props?.collaborationDetail?.questionsToInfluencers?.map(
                  (question, index) => (
                    <Text
                      key={index}
                      style={{
                        fontSize: 16,
                        color: Colors(theme).text,
                      }}
                    >
                      {question}
                    </Text>
                  )
                )}
              </View>
            )}
          <View style={{ width: "100%", gap: 16 }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors(theme).text,
                fontWeight: "bold",
              }}
            >
              Posted by
            </Text>
            <Pressable onPress={() => setManagerModalVisible(true)}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Image
                  source={
                    !managerDetails?.profileImage
                      ? { uri: PLACEHOLDER_IMAGE }
                      : { uri: managerDetails?.profileImage }
                  }
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: Colors(theme).text,
                    }}
                  >
                    {managerDetails?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors(theme).gray100,
                    }}
                  >
                    {managerDetails?.role} -{" "}
                    {props.collaborationDetail.brandName}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </Card.Content>
      </View>
      <Portal>
        <BrandModal
          brand={{
            image: props.collaborationDetail.brandImage,
            name: props.collaborationDetail.brandName,
            description: props.collaborationDetail.brandDescription,
            verified: props.collaborationDetail.paymentVerified,
            website: props.collaborationDetail.brandWebsite,
            category: props.collaborationDetail.brandCategory,
          }}
          visible={brandModalVisible}
          setVisibility={setBrandModalVisible}
        />
        <ManagerModal
          manager={{
            email: managerDetails?.email,
            image: managerDetails?.profileImage,
            name: managerDetails?.name,
          }}
          brandDescription={props.collaborationDetail.brandDescription}
          visible={managerModalVisible}
          setVisibility={setManagerModalVisible}
        />
        <ConfirmationModal
          cancelAction={() => setConfirmationModalVisible(false)}
          confirmAction={() => {
            setConfirmationModalVisible(false);
            withdrawApplication();
          }}
          visible={confirmationModalVisible}
          setVisible={setConfirmationModalVisible}
          confirmText="Yes"
          cancelText="No"
          description="Are you sure you want to withdraw your application?"
        />
      </Portal>
    </ScrollView>
  );
};

export default CollborationDetailsContent;
