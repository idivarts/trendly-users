import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 15,
    },
    jobList: {
      paddingBottom: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: colors.modalBackground,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: "80%",
      borderTopWidth: 0.3,
      width: "100%",
    },
  });
