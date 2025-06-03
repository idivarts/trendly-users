import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Colors(theme).background,
    },
    slide: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors(theme).background,
    },
    skipButton: {
      position: "absolute",
      top: 10,
      right: 20,
    },
    skipIcon: {
      color: Colors(theme).text
    },
    skipButtonText: {
      color: Colors(theme).white,
      fontSize: 16,
    },
    imageContainer: {
      borderRadius: 100,
      overflow: "hidden",
      marginBottom: 20,
    },
    image: {
      width: 300,
      height: 300,
      resizeMode: "contain",
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    paragraph: {
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 20,

      color: Colors(theme).text,
    },
    socialContainer: {
      flexDirection: "column",
      gap: 10,
      justifyContent: "space-between",
      marginTop: 40,
    },
    pagination: {
      bottom: 30,
    },
    buttonWrapper: {
      backgroundColor: Colors(theme).white,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: Colors(theme).eerieBlack,
      marginHorizontal: 5,
    },
  });

export default styles;
