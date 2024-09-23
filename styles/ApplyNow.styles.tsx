import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors(theme).background,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 24,
      color: Colors(theme).gray100,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: 8,
      color: Colors(theme).gray100,
    },
    input: {
      marginBottom: 16,
      backgroundColor: Colors(theme).white,
    },
    helperText: {
      marginBottom: 12,
      color: Colors(theme).gray100,
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
      color: Colors(theme).eerieBlack,
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
    uploadedFilesContainer: {
      marginBottom: 16,
      padding: 8,
      borderColor: Colors(theme).gray100,
      borderWidth: 1,
      borderRadius: 8,
    },
    uploadedFilesTitle: {
      marginBottom: 8,
      fontWeight: "bold",
    },
    fileChip: {
      marginBottom: 8,
      marginRight: 8,
    },
  });
