import { Text, View } from "@/components/theme/Themed";
import TextInput from "@/components/ui/text-input";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const Question: React.FC = () => {
    const colors = Colors(useTheme());
    const styles = useMemo(() => createStyles(colors), [colors]);

    const {
        title,
        value: initialValue,
        path,
        selectedFiles,
        profileAttachments,
        placeholder,
        note,
        timelineData,
        actualQuestion,
        answers,
        originalAttachments,
        collaborationId,
        quotation,
        fileAttachments,
    } = useLocalSearchParams();

    const router = useMyNavigation();

    const [value, setValue] = useState(
        (Array.isArray(initialValue) ? initialValue[0] : initialValue) || ""
    );

    const headerTitleRaw = Array.isArray(title) ? title[0] : title;
    const headerTitle = headerTitleRaw ? String(headerTitleRaw) : "Question";

    const handleSubmit = () => {
        if (!value) {
            Toaster.error("Please enter a value");
            return;
        }

        const valueToSubmit = {
            textbox: {
                title,
                value,
            },
        };
        router.back();
        router.replace({
            //@ts-ignore
            pathname: path as string,
            params: {
                value: JSON.stringify(valueToSubmit),
                selectedFiles,
                profileAttachments,
                timelineData,
                originalAttachments,
                answers,
                quotation,
                note,
                collaborationId,
                fileAttachments,
            },
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    const questionText = Array.isArray(actualQuestion)
        ? actualQuestion[0]
        : actualQuestion;
    const placeholderText = Array.isArray(placeholder)
        ? placeholder[0]
        : placeholder;

    return (
        <AppLayout>
            <ScreenHeader
                title={headerTitle}
                action={handleGoBack}
                rightAction
                rightActionButton={
                    <Pressable
                        onPress={handleSubmit}
                        hitSlop={8}
                        style={styles.donePressable}
                    >
                        <Text style={styles.doneLabel}>Done</Text>
                    </Pressable>
                }
            />
            <Toast />
            <View style={styles.screenBody}>
                <View style={styles.formBlock}>
                    <Text style={styles.questionText}>{questionText}</Text>
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        style={styles.textInput}
                        placeholder={placeholderText as string}
                        autoFocus
                        multiline
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default Question;

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        donePressable: {
            paddingRight: 20,
            paddingVertical: 4,
        },
        doneLabel: {
            color: c.primary,
            fontSize: 16,
        },
        screenBody: {
            paddingHorizontal: 20,
            justifyContent: "space-between",
            flex: 1,
        },
        formBlock: {
            flex: 1,
            gap: 16,
        },
        questionText: {
            fontSize: 16,
            lineHeight: 22,
            color: c.text,
        },
        textInput: {
            minHeight: 100,
        },
    });
}
