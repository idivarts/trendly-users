import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: Colors(theme).text,
        },
        titleActive: {
            fontSize: 20,
            fontWeight: "bold",
            color: "lightblue",
            textDecorationLine: "underline",
        },
        card: {
            backgroundColor: Colors(theme).background,
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
        },
    });
