import AppLayout from "@/layouts/app-layout";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    EnrichedTextInput,
    type EnrichedTextInputInstance,
    type OnChangeStateEvent,
} from "react-native-enriched";

interface EditTextAreaProps {
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
}

const EditTextAreaComponent: React.FC<EditTextAreaProps> = ({
    value,
    setValue,
    placeholder,
}) => {
    const theme = useTheme();
    const editorRef = useRef<EnrichedTextInputInstance>(null);
    const [stylesState, setStylesState] = useState<OnChangeStateEvent | null>(
        null
    );
    const initialValue = useRef(value || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            editorRef.current?.focus();
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    const toolbarButtons = [
        {
            label: "B",
            isActive: stylesState?.isBold,
            onPress: () => editorRef.current?.toggleBold(),
        },
        {
            label: "I",
            isActive: stylesState?.isItalic,
            onPress: () => editorRef.current?.toggleItalic(),
        },
        {
            label: "U",
            isActive: stylesState?.isUnderline,
            onPress: () => editorRef.current?.toggleUnderline(),
        },
        {
            label: "S",
            isActive: stylesState?.isStrikeThrough,
            onPress: () => editorRef.current?.toggleStrikeThrough(),
        },
        {
            label: "UL",
            isActive: stylesState?.isUnorderedList,
            onPress: () => editorRef.current?.toggleUnorderedList(),
        },
        {
            label: "OL",
            isActive: stylesState?.isOrderedList,
            onPress: () => editorRef.current?.toggleOrderedList(),
        },
    ];

    return (
        <AppLayout>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 180 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.editorContainer}>
                        <EnrichedTextInput
                            ref={editorRef}
                            defaultValue={initialValue.current}
                            onChangeHtml={(event) => setValue(event.nativeEvent.value)}
                            onChangeState={(event) => setStylesState(event.nativeEvent)}
                            placeholder={placeholder}
                            placeholderTextColor={Colors(theme).textSecondary}
                            style={[
                                styles.editor,
                                {
                                    backgroundColor: Colors(theme).background,
                                    borderColor: Colors(theme).outline,
                                    color: Colors(theme).text,
                                },
                            ]}
                        />
                    </View>
                </ScrollView>
                <View
                    style={[
                        styles.toolbar,
                        {
                            backgroundColor: Colors(theme).card,
                            borderColor: Colors(theme).outline,
                        },
                    ]}
                >
                    {toolbarButtons.map((button) => {
                        const isActive = Boolean(button.isActive);
                        return (
                            <Pressable
                                key={button.label}
                                onPress={button.onPress}
                                style={[
                                    styles.toolbarButton,
                                    {
                                        backgroundColor: isActive
                                            ? Colors(theme).primary
                                            : "transparent",
                                        borderColor: Colors(theme).outline,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.toolbarButtonText,
                                        {
                                            color: isActive
                                                ? Colors(theme).background
                                                : Colors(theme).text,
                                        },
                                    ]}
                                >
                                    {button.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </KeyboardAvoidingView>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    editorContainer: {
        flex: 1,
    },
    editor: {
        flex: 1,
        minHeight: 220,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    toolbar: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderTopWidth: 1,
    },
    toolbarButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    toolbarButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});

export default EditTextAreaComponent;
