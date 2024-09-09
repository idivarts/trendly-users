import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "lightblue",
    },
    titleActive: {
      fontSize: 20,
      fontWeight: "bold",
      color: "lightblue",
      textDecorationLine: "underline",
    },
    card: {
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
  });
