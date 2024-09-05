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

const CollaborationPage = (props: CollaborationAdCardProps) => {
  const params: Partial<CollaborationAdCardProps> = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <AppLayout>
      <Appbar.Header statusBarHeight={0}>
        <BackButton />
        <Appbar.Content title="Collaboration Details" />
        <IconButton icon="dots-vertical" onPress={() => { }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Collaboration Details */}
        <Card style={styles.profileCard}>
          <Image
            source={{ uri: params.logo }}
            style={styles.profileImage}
            resizeMode="contain"
          />
          <Card.Content style={styles.profileContent}>
            <Text variant="headlineMedium" style={styles.name}>
              {params.collaborationName}
            </Text>
            <Text variant="bodyMedium" style={styles.brandName}>
              {params.brandName}
            </Text>
            <Text variant="bodySmall" style={styles.shortDescription}>
              {params.shortDescription}
            </Text>
            <View style={styles.statsContainer}>
              <Chip icon="checkbox-marked-circle" style={styles.statChip}>
                {params.appliedCount} Applied
              </Chip>
              <Chip icon="eye" style={styles.statChip}>
                {params.brandViewed} Reviewed
              </Chip>
              <Chip icon="map-marker" style={styles.statChip}>
                {params.location}
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
            <Paragraph>{params.adDescription}</Paragraph>
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
            <Paragraph>{params.brandDescription}</Paragraph>
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
            <Paragraph>{params.platform}</Paragraph>
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
            <Paragraph>Cost: {params.cost}</Paragraph>
            <Paragraph>Payment Verified: {params.paymentVerified}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </AppLayout>
  );
};

export default CollaborationPage;
