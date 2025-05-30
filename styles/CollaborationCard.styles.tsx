import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 10,
      backgroundColor: Colors(theme).card,
      shadowColor: Colors(theme).transparent,
    },
    bottomSheetContent: {
      position: "absolute",
      bottom: 0,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    bookmarkIcon: {
      marginLeft: "auto",
    },
    collabName: {
      fontSize: 18,
      fontWeight: "bold",
      maxWidth: "80%",
      color: Colors(theme).text,
    },
    brandName: {
      fontSize: 14,
      color: Colors(theme).text,
      marginTop: 4,
    },
    shortDescription: {
      fontSize: 14,
      color: Colors(theme).text,
      marginTop: 8,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      width: "100%",
    },
    infoText: {
      fontSize: 12,
      color: Colors(theme).text,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
      marginBottom: 4,
      gap: 6,
    },
    actionRow: {
      flexDirection: "row",
      marginTop: 8,
      justifyContent: "space-around",
      alignItems: "center",
    },
  });
