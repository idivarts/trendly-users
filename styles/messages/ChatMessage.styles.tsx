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
    padding: 10,
    position: "relative",
    gap: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  messageTime: {
    fontSize: 10,
  },
});

export default styles;