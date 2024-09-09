import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  avatarImage: {
    backgroundColor: Colors.regular.platinum,
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
    backgroundColor: Colors.regular.primary,
  },
  chevronIcon: {
    alignItems: "flex-end",
  },
});

export default styles;
