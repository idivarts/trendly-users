import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 24,
      color: "#333",
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: 8,
      color: "#555",
    },
    input: {
      marginBottom: 16,
      backgroundColor: "#fff",
    },
    helperText: {
      marginBottom: 12,
      color: "#777",
    },
    card: {
      marginVertical: 16,
      borderRadius: 8,
      elevation: 3,
    },
    cardContent: {
      alignItems: "center",
    },
    uploadIcon: {
      alignSelf: "center",
      color: "#666",
    },
    submitButton: {
      marginTop: 20,
      borderRadius: 8,
    },
    buttonContent: {
      paddingVertical: 8,
    },
    errorText: {
      marginBottom: 12,
      textAlign: "center",
    },
  });