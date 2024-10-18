import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    fontSize: 14,
  },
  messageInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    fontSize: 12,
  },
  newMessagesIcon: {
    backgroundColor: Colors(theme).primary,
    borderRadius: 10,
    height: 10,
    marginTop: 2.5,
    width: 10,
  },
  chevronIcon: {
    alignItems: "flex-end",
  },
});

export default styles;
