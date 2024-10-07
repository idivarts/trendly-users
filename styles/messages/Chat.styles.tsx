import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1 },
  appbar: {
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Colors(theme).primary,
  },
  backButtonContainer: {
    backgroundColor: "transparent",
  },
  appbarContent: {
    alignItems: "flex-start",
  },
  appbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors(theme).white,
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
    backgroundColor: Colors(theme).platinum,
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
