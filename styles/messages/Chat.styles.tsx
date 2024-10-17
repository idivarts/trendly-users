import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1 },
  appbar: {
    paddingVertical: 10,
    backgroundColor: Colors(theme).aliceBlue,
  },
  backButtonContainer: {
    backgroundColor: "transparent",
  },
  appbarContent: {
    marginLeft: 10,
    alignItems: "flex-start",
  },
  appbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors(theme).black,
  },
  flex: { flex: 1 },
  messageListContainer: {
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loadingIndicator: {
    paddingTop: 10,
    paddingBottom: 22,
  },
  processingText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  capturedAssetContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: Colors(theme).aliceBlue,
  },
  closeButton: {
    position: "absolute",
    right: 2,
    top: 2,
    zIndex: 1,
    backgroundColor: Colors(theme).white,
  },
  capturedImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    zIndex: 0,
  },
  capturedVideo: {
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 100,
  },
  capturedVideoStyle: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors(theme).aliceBlue,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors(theme).aliceBlue,
    paddingHorizontal: 0,
  },
  assetModalStyle: {
  },
  assetModalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors(theme).modalBackground,
    flex: 1,
    position: "relative",
    width: "100%",
  },
  assetModalCloseButton: {
    backgroundColor: Colors(theme).white,
    position: "absolute",
    right: 5,
    top: Platform.OS === "web" ? 10 : 100,
    zIndex: 1,
  },
  assetModalAsset: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  videoAsset: {
    resizeMode: "contain",
    width: "100%",
    height: Platform.OS === "web" ? "100%" : 300,
  },
  videoAssetStyle: {
    width: "100%",
  }
});

export default styles;
