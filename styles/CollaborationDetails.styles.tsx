import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import Colors from "@/shared-uis/constants/Colors";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      gap: 16,
      paddingBottom: 24,
    },
    profileCard: {
      backgroundColor: Colors(theme).card,
      borderRadius: 10,
      shadowColor: Colors(theme).transparent,
    },
    profileImage: {
      height: 160,
      marginBottom: 10,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    profileContent: {
      alignItems: "center",
      width: "100%",
      gap: 16,
      paddingTop: 16,
      paddingBottom: 24
    },
    name: {
      fontWeight: "bold",
      fontSize: 20,
      color: Colors(theme).text,
      paddingRight: 16,
      flex: 1,
      lineHeight: 20,
    },
    brandName: {
      fontSize: 16,
      color: Colors(theme).text,
    },
    shortDescription: {
      fontSize: 16,
      color: Colors(theme).text,
      lineHeight: 22,
      textAlign: "left",
      marginTop: 16,
    },
    applyButton: {
      // marginVertical: 16,
    },
    infoCard: {
      backgroundColor: Colors(theme).card,
      borderRadius: 10,
      shadowColor: Colors(theme).transparent,
    },
    paragraph: {
      color: Colors(theme).text,
    },
  });
