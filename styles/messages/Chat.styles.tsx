import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  appbar: {
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
    fontWeight: "bold",
    color: "white",
  },
  flex: { flex: 1 },
  messageListContainer: {
    gap: 10,
    padding: 10,
  },
  loadingIndicator: {
    paddingTop: 10,
    paddingBottom: 22,
  },
  capturedImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.regular.platinum,
    padding: 10,
    paddingBottom: 0,
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.regular.platinum,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.regular.platinum,
    paddingHorizontal: 0,
  },
});

export default styles;
