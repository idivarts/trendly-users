import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  messageContainer: {
    gap: 5,
    maxWidth: "80%",
  },
  messageBubble: {
    borderRadius: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  messageDoc: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageDocText: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
  messageText: {
    padding: 10,
  },
  messageTime: {
    fontSize: 10,
  },
  messageSenderName: {
    fontWeight: "bold",
  },
});

export default styles;
