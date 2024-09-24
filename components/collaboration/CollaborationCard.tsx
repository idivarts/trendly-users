import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Divider, Chip } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationCard.styles";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";

export interface CollaborationAdCardProps extends ICollaboration {
  name: string;
  brandName: string;
  paymentVerified?: boolean;
  appliedCount?: number;
  aiSuccessRate?: string;
  id: string;
  brandHireRate?: string;
  cardType: "collaboration" | "proposal" | "invitation";
  onOpenBottomSheet: (id: string) => void;
}

const JobCard = (props: CollaborationAdCardProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const theme = useTheme();
  const styles = stylesFn(theme);
  const datePosted = new Date(props.timeStamp);

  return (
    <Card
      style={styles.card}
      onPress={() => {
        router.push(`/collaboration-details/${props.id}`);
      }}
    >
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.collabName}>{props.name}</Text>
            <Text style={styles.brandName}>{props.brandName}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#555"
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.onOpenBottomSheet(props.id);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Short Description */}
        <Text style={styles.shortDescription}>{props.description}</Text>

        {/* Posted Date and Cost */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Posted: {formatDistanceToNow(datePosted, { addSuffix: true })}
          </Text>
          <Text style={styles.infoText}>
            Cost: Rs {props.budget ? props.budget.min : ""}-
            {props.budget ? props.budget.max : ""}
          </Text>
        </View>

        {/* Payment Verified, Promotion and Collaboration Type */}
        <View style={styles.chipRow}>
          {props.cardType === "collaboration" && (
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor: props.paymentVerified
                    ? "#d4edda"
                    : "#f8d7da",
                  borderColor: props.paymentVerified ? "#c3e6cb" : "#f5c6cb",
                },
              ]}
              icon={props.paymentVerified ? "check-circle" : "alert-circle"}
              mode={props.paymentVerified ? "outlined" : "flat"}
              selectedColor={props.paymentVerified ? "#28a745" : "#dc3545"}
            >
              {props.paymentVerified
                ? "Payment Verified"
                : "Payment Unverified"}
            </Chip>
          )}
          <Chip style={styles.chip}>{props.promotionType}</Chip>
          <Chip style={styles.chip}>{props.collaborationType}</Chip>
        </View>

        {/* Influencers Needed, Applied Count, AI Success Rate, Brand Hire Rate */}
        {props.cardType === "collaboration" && (
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Influencers Needed: {props.numberOfInfluencersNeeded}
              </Text>
              <Text style={styles.infoText}>
                Applied: {props.appliedCount || 0}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                AI Success Rate: {props.aiSuccessRate || 0}
              </Text>
              <Text style={styles.infoText}>
                Brand Hire Rate: {props.brandHireRate || 0}
              </Text>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default JobCard;
