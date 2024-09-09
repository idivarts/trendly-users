import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const appHeaderStyles = StyleSheet.create({
  appbarHeader: {
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Colors.regular.primary,
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
    color: "white",
  },
});

export default appHeaderStyles;
