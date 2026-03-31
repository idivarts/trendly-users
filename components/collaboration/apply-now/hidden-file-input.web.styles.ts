import Colors from "@/shared-uis/constants/Colors";
import { StyleSheet } from "react-native";

/** Visually hidden native file input for web (trigger via ref.click()). */
export function createHiddenFileInputWebStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        hiddenFileInput: {
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            opacity: 0,
            backgroundColor: c.transparent,
        },
    });
}
