import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors(theme).background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      color: Colors(theme).text,
      fontWeight: "bold",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors(theme).text,
      marginVertical: 10,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    chip: {
      margin: 5,
    },
    salaryContainer: {
      marginVertical: 10,
    },
    salaryLabel: {
      fontSize: 16,
      color: Colors(theme).text,
      marginBottom: 5,
    },
    applyButton: {
      marginTop: 20,
    },
  });
