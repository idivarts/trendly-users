import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Button, Divider, Chip } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationCard.styles";

interface CollaborationAdCardProps {
  collaborationName: string;
  brandName: string;
  cost: string;
  status: {
    sent: boolean;
    active: boolean;
    approvalPending: boolean;
    changesRequested: boolean;
    done: boolean;
    prematureEnd: boolean;
    archived: boolean;
  };
}

const ContractCard = (props: CollaborationAdCardProps) => {
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
            <Text style={styles.collabName}>{props.collaborationName}</Text>
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

        {/* Posted Date and Cost */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Cost: {props.cost}</Text>
        </View>

        {/* Payment Verified, Promotion and Collaboration Type */}
        <View style={styles.chipRow}>
          <Chip style={styles.chip}>
            Active: {props.status.active.toString()}
          </Chip>
          <Chip style={styles.chip}>
            Approval: {props.status.approvalPending ? "Pending" : "Approved"}
          </Chip>
        </View>

        {/* Influencers Needed, Applied Count, AI Success Rate, Brand Hire Rate */}

        {/* Actions */}
        <Divider style={styles.divider} />
        <View style={styles.actionRow}>
          <Link
            href={{
              pathname: "/collaboration-details",
              params: {
                collaborationName: props.collaborationName,
                brandName: props.brandName,
                cost: props.cost,
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
              backgroundColor: Colors(theme).primary,
              width: 150,
            }}
          >
            <Text
              style={{
                color: Colors(theme).white,
                fontWeight: "bold",
                textAlign: "center",
                width: 50,
              }}
            >
              {/* Apply Now */}
              Ask for Payments
            </Text>
          </Link>
          <Button onPress={() => router.push("/edit-proposal")} mode="text">
            End Contract
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ContractCard;
