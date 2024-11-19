import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      padding: 16,
    },
    profileCard: {
      alignItems: "center",
      backgroundColor: Colors(theme).card,
      marginBottom: 16,
      borderRadius: 10,
    },
    profileImage: {
      height: 160,
      marginBottom: 10,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    profileContent: {
      alignItems: "center",
      width: "100%",
    },
    name: {
      fontWeight: "bold",
      width: "100%",
      fontSize: 20,
      color: Colors(theme).text,
      lineHeight: 20,
      marginTop: 8,
    },
    brandName: {
      fontSize: 16,
      color: Colors(theme).text,
    },
    shortDescription: {
      fontSize: 14,
      color: Colors(theme).text,
      textAlign: "center",
      marginVertical: 8,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 12,
      flexWrap: "wrap",
      gap: 8,
    },
    applyButton: {
      marginVertical: 16,
    },
    statChipText: {
      color: Colors(theme).primary,
    },
    statChip: {
      backgroundColor: Colors(theme).platinum,
    },
    infoCard: {
      marginBottom: 16,
      backgroundColor: Colors(theme).card,
      borderRadius: 10,
    },
    cardName: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors(theme).text,
      margin: 16,
    },
    paragraph: {
      color: Colors(theme).text,
    },
  });
