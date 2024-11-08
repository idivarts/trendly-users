import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const SPACING = 8;
const COLUMNS = 3;
const ITEM_WIDTH = (width - SPACING * (COLUMNS + 1)) / COLUMNS;

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors(theme).background,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
    },
    galleryContainer: {
      padding: SPACING,
    },
    itemWrapper: {
      width: ITEM_WIDTH,
      height: ITEM_WIDTH,
      margin: SPACING / 2,
    },
    itemContainer: {
      flex: 1,
      borderRadius: 8,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    checkboxContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: Colors(theme).primary,
      borderTopLeftRadius: 8,
      padding: 2,
    },
    bottomButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    camera: {
      flex: 1,
    },
    cameraButtons: {
      position: "absolute",
      bottom: 30,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 16,
    },
  });
