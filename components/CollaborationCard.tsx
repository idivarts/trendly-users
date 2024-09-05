import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Button, Divider, Chip } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/CollaborationCard.styles";

interface CollaborationAdCardProps {
  location: string;
  collaborationName: string;
  brandName: string;
  shortDescription: string;
  postedDate: string;
  cost: string;
  paymentVerified: boolean;
  promotionType: string;
  collaborationType: string;
  influencersNeeded: number;
  appliedCount: number;
  aiSuccessRate: string;
  brandHireRate: string;
  logo: string;
}

const JobCard = (props: CollaborationAdCardProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.collabName}>{props.collaborationName}</Text>
            <Text style={styles.brandName}>{props.brandName}</Text>
          </View>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#555"
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Short Description */}
        <Text style={styles.shortDescription}>{props.shortDescription}</Text>

        {/* Posted Date and Cost */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Posted: {props.postedDate}</Text>
          <Text style={styles.infoText}>Cost: {props.cost}</Text>
        </View>

        {/* Payment Verified, Promotion and Collaboration Type */}
        <View style={styles.chipRow}>
          <Chip
            style={[
              styles.chip,
              {
                backgroundColor: props.paymentVerified ? "#d4edda" : "#f8d7da",
                borderColor: props.paymentVerified ? "#c3e6cb" : "#f5c6cb",
              },
            ]}
            icon={props.paymentVerified ? "check-circle" : "alert-circle"}
            mode={props.paymentVerified ? "outlined" : "flat"}
            selectedColor={props.paymentVerified ? "#28a745" : "#dc3545"}
          >
            {props.paymentVerified ? "Payment Verified" : "Payment Unverified"}
          </Chip>
          <Chip style={styles.chip}>{props.promotionType}</Chip>
          <Chip style={styles.chip}>{props.collaborationType}</Chip>
        </View>

        {/* Influencers Needed, Applied Count, AI Success Rate, Brand Hire Rate */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Influencers Needed: {props.influencersNeeded}
          </Text>
          <Text style={styles.infoText}>Applied: {props.appliedCount}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            AI Success Rate: {props.aiSuccessRate}
          </Text>
          <Text style={styles.infoText}>
            Brand Hire Rate: {props.brandHireRate}
          </Text>
        </View>

        {/* Actions */}
        <Divider style={styles.divider} />
        <View style={styles.actionRow}>
          <Link
            href={{
              pathname: "/collaboration-details",
              params: {
                collaborationName: props.collaborationName,
                brandName: props.brandName,
                shortDescription: props.shortDescription,
                postedDate: props.postedDate,
                cost: props.cost,
                paymentVerified: props.paymentVerified.toString(),
                promotionType: props.promotionType,
                collaborationType: props.collaborationType,
                influencersNeeded: props.influencersNeeded,
                appliedCount: props.appliedCount,
                aiSuccessRate: props.aiSuccessRate,
                brandHireRate: props.brandHireRate,
                logo: props.logo,
                location: props.location,
              },
            }}
          >
            <Button mode="text">View</Button>
          </Link>
          <Link
            href={"apply-now"}
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: colors.primary,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Apply Now
            </Text>
          </Link>
          <Button onPress={() => router.push("/report")} mode="text">
            Report
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default JobCard;
