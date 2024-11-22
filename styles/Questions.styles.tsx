import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "space-between",
      backgroundColor: Colors(theme).background,
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
      color: Colors(theme).text,
    },
    optionItem: {
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: Colors(theme).card,
    },
    selectedOption: {
      fontWeight: "bold",
      color: Colors(theme).white,
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
      color: Colors(theme).text,
      fontSize: 16,
    },
  });
