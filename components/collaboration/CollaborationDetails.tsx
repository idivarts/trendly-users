import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Chip,
  Appbar,
  Card,
  Paragraph,
  IconButton,
} from "react-native-paper";
import AppLayout from "@/layouts/app-layout";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "@/styles/CollaborationDetails.styles";
import BackButton from "@/components/ui/back-button/BackButton";

interface CollaborationAdCardProps {
  collaborationName: string;
  brandName: string;
  shortDescription: string;
  brandDescription: string;
  adDescription: string;
  platform: string;
  externalLinks: string[];
  influencersViewed: number;
  brandViewed: number;
  postedDate: string;
  cost: string;
  paymentVerified: string;
  promotionType: string;
  collaborationType: string;
  influencersNeeded: number;
  appliedCount: number;
  aiSuccessRate: string;
  location: string;
  brandHireRate: string;
  logo: string;
}

const CollaborationPage = (props: any) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <AppLayout>
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: colors.background,
        }}
      >
        <BackButton />
        <Appbar.Content title="Collaboration Details" color={colors.text} />
        <IconButton icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Collaboration Details */}
        <Card style={styles.profileCard}>
          <Image
            source={{ uri: props.logo }}
            style={styles.profileImage}
            resizeMode="contain"
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
            <View style={styles.statsContainer}>
              <Chip icon="checkbox-marked-circle" style={styles.statChip}>
                {props.appliedCount} Applied
              </Chip>
              <Chip icon="eye" style={styles.statChip}>
                {props.brandViewed} Reviewed
              </Chip>
              <Chip icon="map-marker" style={styles.statChip}>
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
            <Paragraph>{props.collaborationDetail.description}</Paragraph>
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
            <Paragraph>{props.collaborationDetail.brandDescription}</Paragraph>
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
            <Paragraph>{props.collaborationDetail.platform}</Paragraph>
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
            <Paragraph>Cost: {props.collaborationDetail.budget.min}</Paragraph>
            <Paragraph>
              Payment Verified:{" "}
              {props.collaborationDetail.paymentVerified ? "True" : "False"}
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </AppLayout>
  );
};

export default CollaborationPage;
