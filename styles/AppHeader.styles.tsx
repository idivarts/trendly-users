import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const appHeaderStyles = (theme: Theme) => StyleSheet.create({
  appbarHeader: {
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Colors(theme).primary,
  },
  backButtonContainer: {
    backgroundColor: "transparent",
  },
  appbarContent: {
    alignItems: "flex-start",
  },
  appbarTitle: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    color: Colors(theme).white,
  },
});

export default appHeaderStyles;
