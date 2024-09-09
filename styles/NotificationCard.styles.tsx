import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
    },
    card: {
      marginVertical: 8,
      padding: 10,
      backgroundColor: colors.card,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    content: {
      marginLeft: 10,
      flex: 1,
      color: colors.text,
    },
    adName: {
      fontWeight: "bold",
      color: colors.text,
    },
    time: {
      color: colors.text,
      marginTop: 5,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    markAsReadButton: {
      marginLeft: 10,
    },
  });
