import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
    settingsContainer: {
        flex: 1,
        padding: 16,
    },
    settingsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 20,
    },
    settingsLabel: {
        fontSize: 18,
    },
});

export default styles;
