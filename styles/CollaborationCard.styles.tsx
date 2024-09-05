import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 10,
      margin: 10,
      backgroundColor: colors.card,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bookmarkIcon: {
      marginLeft: "auto",
    },
    collabName: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      color: colors.text,
    },
    brandName: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    shortDescription: {
      fontSize: 14,
      color: colors.text,
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
      color: colors.text,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: 8,
    },
    chip: {
      marginHorizontal: 4,
      marginBottom: 4,
    },
    divider: {
      marginVertical: 10,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
  });
