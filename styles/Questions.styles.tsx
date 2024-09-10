import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "space-between",
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    questionText: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
      color: colors.text,
    },
    optionItem: {
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: colors.card,
    },
    selectedOption: {
      fontWeight: "bold",
      color: "#fff",
    },
    bottomNavigation: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 20,
    },
    nextButton: {
      alignSelf: "flex-end",
    },
    skipButton: {
      position: "absolute",
      bottom: 20,
      left: 20,
    },
    skipText: {
      color: colors.text,
      fontSize: 16,
    },
  });
