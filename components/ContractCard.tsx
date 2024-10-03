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
  id: string;
  onOpenBottomSheet: (id: string) => void;
}

const ContractCard = (props: CollaborationAdCardProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const styles = stylesFn(theme);

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
            <Text style={styles.collabName}>{props.collaborationName}</Text>
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
                color={Colors(theme).gray100}
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
      </Card.Content>
    </Card>
  );
};

export default ContractCard;
