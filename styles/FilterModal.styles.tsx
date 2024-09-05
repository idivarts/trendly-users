import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      color: colors.text,
      fontWeight: "bold",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
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
      color: colors.text,
      marginBottom: 5,
    },
    applyButton: {
      marginTop: 20,
    },
  });
