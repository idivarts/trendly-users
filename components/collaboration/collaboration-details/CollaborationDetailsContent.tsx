import React from "react";
import { View, Image, ScrollView } from "react-native";
import {
  Text,
  Card,
  Paragraph,
  Button,
} from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import { FirestoreDB } from "@/utils/firestore";
import { doc, updateDoc } from "firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useAuthContext, useNotificationContext } from "@/contexts";
import Tag from "@/components/ui/tag";
import { CollaborationDetail } from ".";
import { Invitation } from "@/types/Collaboration";
import { faBolt, faEye, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";

interface CollaborationDetailsContentProps {
  pageID: string;
  cardType: string; // "collaboration" | "invitation"
  collaborationDetail: CollaborationDetail;
  logo?: string;
  invitationData?: Invitation;
}

const CollborationDetailsContent = (props: CollaborationDetailsContentProps) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [status, setStatus] = React.useState("pending");
  const cardType = props.cardType;

  const { createNotification } = useNotificationContext();
  const { user } = useAuthContext();

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
    });

    Toaster.success("Invitation accepted successfully");

    props.invitationData = {
      ...props.invitationData,
      status: "accepted",
    };
    setStatus("accepted");
    Toaster.success("Invitation Accepted");
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Collaboration Details */}
      <Card style={styles.profileCard}>
        <Image
          source={{
            uri:
              props.logo ||
              "https://cdn.pixabay.com/photo/2022/09/21/17/02/blue-background-7470781_640.jpg",
          }}
          style={styles.profileImage}
        />
        <Card.Content style={styles.profileContent}>
          <Text variant="headlineMedium" style={styles.name}>
            {props.collaborationDetail.name}
          </Text>
          <Text variant="bodyMedium" style={styles.brandName}>
            {props.collaborationDetail.brandName}
          </Text>
          <Text variant="bodySmall" style={styles.shortDescription}>
            {props.collaborationDetail.description}
          </Text>
          {cardType === "collaboration" && (
            <Button
              mode="contained"
              style={styles.applyButton}
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
          <View style={styles.statsContainer}>
            {
              props.collaborationDetail.promotionType && (
                <Tag
                  icon={() => (
                    <FontAwesomeIcon
                      color={Colors(theme).primary}
                      icon={faBolt}
                      size={14}
                    />
                  )}
                >
                  {props.collaborationDetail.promotionType}
                </Tag>
              )
            }
            {
              props.collaborationDetail.collaborationType && (
                <Tag
                  icon={() => (
                    <FontAwesomeIcon
                      color={Colors(theme).primary}
                      icon={faEye}
                      size={14}
                    />
                  )}
                >
                  {props.collaborationDetail.collaborationType}
                </Tag>
              )
            }
            <Tag
              icon={() => (
                <FontAwesomeIcon
                  color={Colors(theme).primary}
                  icon={faLocationDot}
                  size={14}
                />
              )}
            >
              {
                props.collaborationDetail.location.type === "Remote"
                  ? "Remote"
                  : props.collaborationDetail.location.name
              }
            </Tag>
          </View>
        </Card.Content>
      </Card>

      {/* Ad Description Section */}
      <Card style={styles.infoCard}>
        {/* <Card.Title title="Ad Description" /> */}
        <View>
          <Text variant="headlineSmall" style={styles.cardName}>
            Ad Description
          </Text>
        </View>
        <Card.Content>
          <Paragraph
            style={styles.paragraph}
          >
            {props.collaborationDetail.description}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* About Brand Section */}
      <Card style={styles.infoCard}>
        <View>
          <Text variant="headlineSmall" style={styles.cardName}>
            About Brand
          </Text>
        </View>
        <Card.Content>
          <Paragraph
            style={styles.paragraph}
          >
            {props.collaborationDetail.description}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Platform Section */}
      <Card style={styles.infoCard}>
        <View>
          <Text variant="headlineSmall" style={styles.cardName}>
            Platform
          </Text>
        </View>
        <Card.Content>
          <Paragraph style={styles.paragraph}>Instagram</Paragraph>
        </Card.Content>
      </Card>

      {/* Payment Details Section */}
      <Card style={styles.infoCard}>
        <View>
          <Text variant="headlineSmall" style={styles.cardName}>
            Payment Details
          </Text>
        </View>
        <Card.Content>
          <Paragraph
            style={styles.paragraph}
          >
            Cost: {props.collaborationDetail.budget.min}
          </Paragraph>
          <Paragraph
            style={styles.paragraph}
          >
            Payment Verified: True
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default CollborationDetailsContent;
