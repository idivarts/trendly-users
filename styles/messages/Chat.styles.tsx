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
    position: "relative",
    backgroundColor: Colors.regular.platinum,
    padding: 10,
    paddingBottom: 0,
  },
  closeButton: {
    position: "absolute",
    right: 2,
    top: 2,
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
  imageModalContainer: {
    flex: 1,
    width: "100%",
  },
  imageModalStyle: {
    margin: 0,
  },
  imageModalImageContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  imageModalCloseButton: {
    backgroundColor: "white",
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  imageModalImage: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
});

export default styles;
