import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
