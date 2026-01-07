import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const stylesFn = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).tag,
        borderRadius: 8,
        padding: 4,
    },
    option: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    selectedOption: {
        backgroundColor: Colors(theme).primary,
        shadowColor: Colors(theme).black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    optionMargin: {
        marginLeft: 4,
    },
    optionText: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors(theme).text,
    },
    selectedOptionText: {
        color: Colors(theme).white,
    },
});

export default stylesFn;
