import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    scrollView: {},
    scrollViewContent: {
      gap: 16,
      paddingRight: 32,
    },
    fileContainer: {
      backgroundColor: theme.dark
        ? Colors(theme).card
        : Colors(theme).aliceBlue,
      width: 250,
      height: 250,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      borderRadius: 10,
    },
    video: {
      minWidth: 250,
      maxWidth: 250,
      height: 250,
      overflow: "hidden",
      borderRadius: 10,
      ...(Platform.OS === "web" && {
        width: "100%",
        height: 250,
      }),
    },
    image: {
      borderRadius: 10,
      minWidth: 250,
      maxWidth: 250,
      height: 250,
      overflow: "hidden",
    },
    iconButton: {
      position: "absolute",
      bottom: 8,
      right: 8,
      borderRadius: 50,
    },
    editButton: {
      zIndex: 1,
      position: "absolute",
      bottom: 16,
      left: 32,
    },
  });

export default stylesFn;
