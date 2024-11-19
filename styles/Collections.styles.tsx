import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors(theme).background,
      padding: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: Colors(theme).modalBackground,
    },
    modalContent: {
      backgroundColor: Colors(theme).background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: "80%",
      borderTopWidth: 0.3,
      width: "100%",
    },
  });
