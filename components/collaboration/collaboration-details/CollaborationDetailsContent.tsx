import React from "react";
import { View, Image, ScrollView } from "react-native";
import {
  Text,
  Chip,
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

interface CollaborationAdCardProps {
  pageID: string;
  cardType: "collaboration" | "invitation";
  collaborationDetail: {
    name: string;
    brandName: string;
    description: string;
    appliedCount: number;
    brandViewed: number;
    location: {
      name: string;
    };
    budget: {
      min: number;
      max: number;
    };
  };
  logo?: string;
  invitationData?: {
    collaborationId: string;
    managerId: string;
    message: string;
    status: string;
    timeStamp: number;
    userId: string;
  };
}

const CollborationDetailsContent = (props: any) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [status, setStatus] = React.useState("pending");
  const cardType = props.cardType;

  const { createNotification } = useNotificationContext();
  const { user } = useAuthContext();

  const acceptInvitation = async () => {
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
        props.invitationData.managerId,
        {
          data: {
            userId: user?.id,
            collaborationId: props.invitationData.collaborationId,
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
            <Chip
              icon="checkbox-marked-circle"
              style={styles.statChip}
              textStyle={styles.statChipText}
            >
              {props.collaborationDetail.appliedCount} Applied
            </Chip>
            <Chip
              icon="eye"
              style={styles.statChip}
              textStyle={styles.statChipText}
            >
              {props.collaborationDetail.brandViewed} Reviewed
            </Chip>
            <Chip
              icon="map-marker"
              style={styles.statChip}
              textStyle={styles.statChipText}
            >
              {props.collaborationDetail.location.name}
            </Chip>
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
        {/* <Card.Title title="About Brand" /> */}
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
        {/* <Card.Title title="Platform" /> */}
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
        {/* <Card.Title title="Payment Details" /> */}
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