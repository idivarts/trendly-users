import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationCard.styles";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import Colors from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleExclamation,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

export interface CollaborationAdCardProps extends ICollaboration {
  name: string;
  brandName: string;
  paymentVerified?: boolean;
  appliedCount?: number;
  aiSuccessRate?: string;
  id: string;
  brandHireRate?: string;
  cardType: "collaboration" | "proposal" | "invitation";
  data?: any;
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
        router.push({
          // @ts-ignore
          pathname: `/collaboration-details/${props.id}`,
          params: {
            cardType: props.cardType,
            cardId: props.data ? props.data.id : "",
            collaborationID:
              props.cardType === "invitation" ? props.data.collaborationId : "",
          },
        });
      }}
    >
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.collabName}>{props.name}</Text>
            <Text style={styles.brandName}>{props.brandName}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.onOpenBottomSheet(props.id);
              }}
            >
              <FontAwesomeIcon
                icon={faEllipsis}
                size={24}
                color={Colors(theme).text}
              />
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
                {
                  backgroundColor: props.paymentVerified
                    ? "#d4edda"
                    : "#f8d7da",
                  borderColor: props.paymentVerified ? "#c3e6cb" : "#f5c6cb",
                },
              ]}
              icon={
                props.paymentVerified
                  ? () => (
                      <FontAwesomeIcon
                        color="#28a745"
                        icon={faCircleExclamation}
                        size={16}
                      />
                    )
                  : () => (
                      <FontAwesomeIcon
                        color="#dc3545"
                        icon={faCircleExclamation}
                        size={16}
                      />
                    )
              }
              mode={props.paymentVerified ? "outlined" : "flat"}
              selectedColor={props.paymentVerified ? "#28a745" : "#dc3545"}
            >
              {props.paymentVerified
                ? "Payment Verified"
                : "Payment Unverified"}
            </Chip>
          )}
          <Chip>{props.promotionType}</Chip>
          <Chip>{props.platform}</Chip>
          <Chip>
            {
              //@ts-ignore
              props.collaborationType
            }
          </Chip>
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
