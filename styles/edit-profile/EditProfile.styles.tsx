import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (
    theme: Theme,
) => StyleSheet.create({
    scrollContentContainerStyle: {
        width: '100%',
        flexGrow: 1,
        paddingBottom: 80,
    },
    inputsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
        gap: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    saveButtonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexGrow: 1,
        width: '100%',
    },
    processPercentage: {
        backgroundColor: Colors(theme).transparent,
    },
    saveButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
