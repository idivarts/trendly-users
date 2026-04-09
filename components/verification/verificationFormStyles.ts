import { StyleSheet } from "react-native";

import Colors from "@/shared-uis/constants/Colors";

export function createVerificationFormStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        container: {
            padding: 16,
            paddingBottom: 120,
            gap: 24,
        },
        field: {
            gap: 6,
        },
        helper: {
            fontSize: 12,
            color: colors.subtitleGray,
        },
        error: {
            fontSize: 12,
            color: colors.errorBannerText,
        },
        bottomContainer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.formBorder,
            backgroundColor: colors.background,
        },
        bottomContainerGap: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.formBorder,
            backgroundColor: colors.background,
            gap: 12,
        },
        checkboxRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        checkboxRowSpaced: {
            marginBottom: 12,
        },
        checkbox: {
            width: 18,
            height: 18,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: colors.outline,
        },
        checked: {
            backgroundColor: colors.primary,
        },
        checkboxText: {
            fontSize: 14,
            color: colors.text,
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        buttonWithTopMargin: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 8,
        },
        buttonDisabled: {
            opacity: 0.5,
        },
        buttonText: {
            color: colors.onPrimary,
            fontSize: 15,
            fontWeight: "600",
        },
    });
}
