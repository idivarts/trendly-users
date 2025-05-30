import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors(theme).background,
      paddingHorizontal: 16,
    },
    contentContainerStyle: {
      paddingBottom: 40,
      paddingTop: 16,
      gap: 16,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 24,
      color: Colors(theme).gray100,
    },
    previewContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    previewItem: {
      marginRight: 10,
      width: 80,
      height: 80,
      borderRadius: 8,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    previewVideo: {
      width: "100%",
      height: "100%",
    },

    label: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: 8,
      color: Colors(theme).gray100,
    },
    input: {
      marginBottom: 12,
    },
    helperText: {
      paddingHorizontal: 2,
      color: Colors(theme).text,
    },
    card: {
      backgroundColor: Colors(theme).card,
      borderRadius: 8,
      padding: 16,
      elevation: 3,
    },
    cardContent: {
      alignItems: "center",
    },
    cardParagraph: {
      textAlign: "center",
      color: Colors(theme).text,
    },
    uploadIcon: {
      alignSelf: "center",
      color: Colors(theme).eerieBlack,
    },
    submitButton: {
      marginTop: 20,
      borderRadius: 36,
    },
    buttonContent: {
      paddingVertical: 4,
    },
    errorText: {
      marginBottom: 12,
      textAlign: "center",
    },
    processText: {
      marginBottom: 12,
      color: Colors(theme).success,
      textAlign: "center",
    },
    progressBar: {
      marginBottom: 12,
      backgroundColor: Colors(theme).transparent,
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
