import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      borderBottomColor: Colors(theme).aliceBlue,
      borderBottomWidth: 1,
      minHeight: 150,
      paddingTop: 40,
      paddingBottom: 20,
    },
    avatar: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors(theme).primary,
    },
    textContainer: {
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
    },
    titleText: {
      fontSize: 22,
    },
  });

export default styles;
