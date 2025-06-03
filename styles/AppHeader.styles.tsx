import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const appHeaderStyles = (theme: Theme) => StyleSheet.create({
  appbarHeader: {
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Colors(theme).background,
  },
  backButtonContainer: {
    backgroundColor: "transparent",
  },
  appbarContent: {
  },
  appbarTitle: {
    color: Colors(theme).text,
  },
});

export default appHeaderStyles;
