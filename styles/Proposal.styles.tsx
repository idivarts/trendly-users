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
    },
    titleActive: {
      fontSize: 20,
      fontWeight: "bold",
      color: "rgb(120, 69, 172)",
      textDecorationLine: "underline",
    },
  });
