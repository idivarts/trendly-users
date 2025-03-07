import CreateCollaborationMap from "@/components/create-collaboration/CreateCollaborationMap";
import AuthModal from "@/components/modals/AuthModal";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import Colors from "@/constants/Colors";
import {
  useAuthContext,
  useContractContext,
  useNotificationContext,
} from "@/contexts";
import { useBreakpoints } from "@/hooks";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import Carousel from "@/shared-uis/components/carousel/carousel";
import ScrollMedia from "@/shared-uis/components/carousel/scroll-media";
import ImageComponent from "@/shared-uis/components/image-component";
import RatingSection from "@/shared-uis/components/rating-section";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import { Invitation } from "@/types/Collaboration";
import { Contract } from "@/types/Contract";
import { processRawAttachment } from "@/utils/attachments";
import { formatTimeToNow } from "@/utils/date";
import { FirestoreDB } from "@/utils/firestore";
import { truncateText } from "@/utils/profile";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCheckCircle,
  faCircleInfo,
  faDollarSign,
  faFilm,
  faHouseLaptop,
  faLocationDot,
  faPanorama,
  faRecordVinyl,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Linking, Platform, Pressable, ScrollView, View } from "react-native";
import { Card, Portal, Text } from "react-native-paper";
import { CollaborationDetail } from ".";
import ChipCard from "../card-components/ChipComponent";
import UserResponse from "../UserResponse";
import BrandModal from "./modal/BrandModal";
import ManagerModal from "./modal/ManagerModal";

interface ApplicationData extends IApplications {
  id: string;
}

interface CollaborationDetailsContentProps {
  pageID: string;
  cardType: string; // "collaboration" | "invitation" | "application" | "public-collaboration"
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
  const [contracts, setContracts] = useState<Contract[]>([]);

  const authModalBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const {
    createNotification,
    sendNotification,
  } = useNotificationContext();
  const { user } = useAuthContext();
  const { getContractsByCollaborationId } = useContractContext();

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

  const fetchContracts = async () => {
    const fetchedContracts = await getContractsByCollaborationId(
      props.collaborationDetail.id
    );

    setContracts(fetchedContracts);
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
      ).then(() => {
        setStatus("accepted");
        Toaster.success("Invitation accepted successfully");

        sendNotification(
          {
            managers: [props?.invitationData?.managerId || ""],
          },
          {
            notification: {
              title: "Invitation Accepted",
              description: `${user?.name} with email id ${user?.email} accepted invitation to collaborate for ${props.collaborationDetail.name}`,
            },
          },
        );

        router.navigate(`/apply-now/${props?.invitationData?.collaborationId}`);
      });
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

  const getFeedbacks = (contract: Contract[]) => {
    let feedbacks: {
      ratings?: number;
      review?: string;
    }[] = [];

    contract.forEach((contract) => {
      if (contract.feedbackFromInfluencer) {
        feedbacks.push({
          ratings: contract.feedbackFromInfluencer.ratings,
          review: contract.feedbackFromInfluencer.feedbackReview,
        });
      }

      if (contract.feedbackFromBrand) {
        feedbacks.push({
          ratings: contract.feedbackFromBrand.ratings,
          review: contract.feedbackFromBrand.feedbackReview,
        });
      }
    });

    return feedbacks;
  };

  useEffect(() => {
    fetchManagerDetails();
  }, []);

  useEffect(() => {
    fetchContracts();
  }, []);
  const { xl } = useBreakpoints()

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Collaboration Details */}
      <View style={styles.profileCard}>
        {props?.collaborationDetail?.attachments &&
          props?.collaborationDetail?.attachments.length > 0 && (
            (Platform.OS === "web" && xl) ? (<ScrollMedia
              media={props?.collaborationDetail?.attachments?.map((attachment) =>
                processRawAttachment(attachment)
              ) || []}
              MAX_WIDTH_WEB={"100%"}
              xl={xl}
              mediaRes={{ width: 300, height: 300 }}
            />) : (<Carousel
              theme={theme}
              data={
                props?.collaborationDetail?.attachments?.map((attachment) =>
                  processRawAttachment(attachment)
                ) || []
              }
            />)
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
                marginTop: 4,
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
                  {formatTimeToNow(props.collaborationDetail.timeStamp)}
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
              <RatingSection feedbacks={getFeedbacks(contracts)} />
              <Pressable
                style={{ flex: 1, flexDirection: "column", gap: 16 }}
                onPress={() => setBrandModalVisible(true)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexGrow: 1,
                  }}
                >
                  <ImageComponent
                    url={props.collaborationDetail.brandImage}
                    altText="Brand Logo"
                    shape="square"
                    size="small"
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
                        60
                      )}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Card.Content>
          </View>

          {cardType === "public-collaboration" && (
            <View
              style={{
                gap: 16,
                width: "100%",
              }}
            >
              <Button
                mode="contained"
                style={{
                  width: "100%",
                }}
                onPress={() => {
                  authModalBottomSheetModalRef.current?.present();
                }}
              >
                Register Now
              </Button>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: Colors(theme).gold,
                  borderRadius: 5,
                  flexDirection: "row",
                  gap: 10,
                  padding: 16,
                }}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  size={20}
                  color={Colors(theme).primary}
                />
                <Text
                  style={{
                    fontSize: 16,
                    width: "95%",
                  }}
                >
                  Please make sure to use this chat to first understand the
                  influencer. Post that, you can start your collaboration here
                </Text>
              </View>
            </View>
          )}

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
                        backgroundColor: Colors(theme).background,
                        borderColor: Colors(theme).primary,
                        borderWidth: 0.3,
                      }}
                      textColor={Colors(theme).text}
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
                    ? `Rs. ${props.collaborationDetail?.budget?.min}`
                    : `Rs. ${props.collaborationDetail?.budget?.min} - Rs. ${props.collaborationDetail?.budget?.max}`}
                </Text>
              )}
          </View>
          {/* chips */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              rowGap: 16,
            }}
          >
            <ChipCard
              chipText={
                props.collaborationDetail.promotionType ===
                  PromotionType.PAID_COLLAB
                  ? "Paid"
                  : "Barter"
              }
              chipIcon={faDollarSign}
            />
            <ChipCard
              chipText={props.collaborationDetail.location.type}
              chipIcon={
                props.collaborationDetail.location.type === "On-Site"
                  ? faLocationDot
                  : faHouseLaptop
              }
            />

            {props.collaborationDetail.platform &&
              props.collaborationDetail.platform.map((content, index) => (
                <ChipCard
                  key={index}
                  chipText={content}
                  chipIcon={
                    content === "Instagram"
                      ? faInstagram
                      : content === "Facebook"
                        ? faFacebook
                        : content === "Youtube"
                          ? faYoutube
                          : faInstagram
                  }
                />
              ))}

            {props.collaborationDetail.contentFormat &&
              props.collaborationDetail.contentFormat.map((content, index) => (
                <ChipCard
                  key={index}
                  chipText={content}
                  chipIcon={
                    content === "Posts"
                      ? faPanorama
                      : content === "Reels"
                        ? faFilm
                        : content === "Stories"
                          ? faHeart
                          : content === "Live"
                            ? faRecordVinyl
                            : content === "Product Reviews"
                              ? faStarHalfStroke
                              : faPanorama
                  }
                />
              ))}
          </View>

          {props.collaborationDetail.location.type === "On-Site" && (
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
                onMapRegionChange={(region) => { }}
                onFormattedAddressChange={(address) => { }}
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
                <ImageComponent
                  url={managerDetails?.profileImage}
                  shape="circle"
                  initials={managerDetails?.name}
                  altText="Manager Profile Image"
                  size="small"
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
        <AuthModal bottomSheetModalRef={authModalBottomSheetModalRef} />
      </Portal>
    </ScrollView>
  );
};

export default CollborationDetailsContent;
