import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  avatarImage: {
    backgroundColor: Colors(theme).platinum,
  },
  contentContainer: {
    flex: 1,
  },
  textGroup: {
    gap: 5,
  },
  titleText: {
    fontWeight: "bold",
  },
  messageInfo: {
    gap: 5,
    alignItems: "flex-end",
  },
  newMessagesAvatar: {
    backgroundColor: Colors(theme).primary,
  },
  chevronIcon: {
    alignItems: "flex-end",
  },
});

export default styles;
