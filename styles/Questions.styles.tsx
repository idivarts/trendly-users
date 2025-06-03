import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "space-between",
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
    },
    bottomNavigation: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 20,
    },
    nextButton: {
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: Colors(theme).primary,
      borderRadius: 50,
      justifyContent: "center",
      padding: 10,
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
