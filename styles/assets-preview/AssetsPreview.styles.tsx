import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

const stylesFn = (theme: Theme) => StyleSheet.create({
  container: {
    position: "relative",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    gap: 16,
    paddingRight: 32,
  },
  fileContainer: {
    backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).aliceBlue,
    width: 250,
    height: 250,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  video: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
    ...((Platform.OS === "ios" || Platform.OS === "android") && {
      height: 250,
    }),
  },
  image: {
    borderRadius: 10,
    height: 250,
    overflow: "hidden",
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    borderRadius: 50,
  },
  editButton: {
    zIndex: 1,
    position: "absolute",
    bottom: 16,
    left: 32,
  },
});

export default stylesFn;
