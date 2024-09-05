import { StyleSheet } from "react-native";

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background,
    },
    slide: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    imageContainer: {
      borderRadius: 100,
      overflow: "hidden",
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: "contain",
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    paragraph: {
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 20,
      color: "#6b6b6b",
    },
    socialContainer: {
      flexDirection: "column",
      gap: 10,
      justifyContent: "space-between",
      marginTop: 20,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    icon: {
      marginRight: 10,
    },
    socialButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    pagination: {
      bottom: 30,
    },
    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#ccc",
      marginHorizontal: 5,
    },
  });

export default createStyles;
