import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Button, Divider, Chip } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationCard.styles";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import Colors from "@/constants/Colors";

export interface CollaborationAdCardProps extends ICollaboration {
  name: string;
  brandName: string;
  paymentVerified?: boolean;
  appliedCount?: number;
  aiSuccessRate?: string;
  id: string;
  brandHireRate?: string;
  cardType: "collaboration" | "proposal" | "invitation";
}

const JobCard = (props: CollaborationAdCardProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.collabName}>{props.name}</Text>
            <Text style={styles.brandName}>{props.brandName}</Text>
          </View>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={Colors(theme).gray100}
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Short Description */}
        <Text style={styles.shortDescription}>{props.description}</Text>

        {/* Posted Date and Cost */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Posted: {props.timeStamp}</Text>
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
                    ? Colors(theme).success
                    : Colors(theme).pink,
                },
              ]}
              icon={props.paymentVerified ? "check-circle" : "alert-circle"}
              mode={props.paymentVerified ? "outlined" : "flat"}
              selectedColor={props.paymentVerified ? Colors(theme).successForeground : Colors(theme).pinkForeground}
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
          </View>
        )}

        {/* Actions */}
        <Divider style={styles.divider} />
        <View style={styles.actionRow}>
          <Link
            href={
              props.cardType === "collaboration"
                ? {
                  pathname: `/collaboration-details/${props.id}`,
                  params: {
                    collaborationName: props.name,
                    brandName: props.brandName,
                    shortDescription: props.description,
                    postedDate: props.timeStamp,
                    cost: props.budget ? props.budget.min : "",
                    paymentVerified:
                      props.paymentVerified == null
                        ? "false"
                        : props.paymentVerified.toString(),
                    promotionType: props.promotionType,
                    collaborationType: props.collaborationType,
                    influencersNeeded: props.numberOfInfluencersNeeded,
                    appliedCount: props.appliedCount,
                    aiSuccessRate: props.aiSuccessRate,
                    brandHireRate: props.brandHireRate,
                    location: props.location ? props.location.latlong : "",
                  },
                }
                : `/collaboration-details/`
            }
          >
            <Button mode="text">View</Button>
          </Link>
          <Link
            href={"/apply-now/" + props.id}
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: Colors(theme).primary,
            }}
          >
            <Text
              style={{
                color: Colors(theme).white,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {/* Apply Now */}
              {
                {
                  collaboration: "Apply Now",
                  proposal: "Apply Now",
                  invitation: "Withdraw",
                }[props.cardType]
              }
            </Text>
          </Link>
          {props.cardType === "collaboration" && (
            <Button onPress={() => router.push("/report")} mode="text">
              Report
            </Button>
          )}
          {props.cardType === "proposal" && (
            <Button onPress={() => router.push("/edit-proposal")} mode="text">
              Reject
            </Button>
          )}
          {props.cardType === "invitation" && (
            <TouchableOpacity
              onPress={() => router.push("/withdraw")}
              style={{
                padding: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: Colors(theme).primary,

                  textAlign: "center",
                }}
              >
                Change Terms
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default JobCard;
