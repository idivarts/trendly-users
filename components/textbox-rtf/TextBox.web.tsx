import { Text, View } from "@/shared-uis/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

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
    const [isEmpty, setIsEmpty] = useState(!value);
    const [, setSelectionTick] = useState(0);

    const editorStyle = useMemo(() => {
        const colors = Colors(theme);
        return [
            "min-height: 220px",
            "padding: 12px",
            "outline: none",
            `color: ${colors.text}`,
            `background-color: ${colors.background}`,
            "font-size: 16px",
        ].join("; ");
    }, [theme]);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: value || "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setValue(html);
            setIsEmpty(editor.isEmpty);
        },
        onSelectionUpdate: () => {
            setSelectionTick((tick) => tick + 1);
        },
        editorProps: {
            attributes: {
                style: editorStyle,
            },
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const html = editor.getHTML();
        if ((value || "") !== html) {
            editor.commands.setContent(value || "", false);
        }
        setIsEmpty(editor.isEmpty);
    }, [editor, value]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.setOptions({
            editorProps: {
                attributes: {
                    style: editorStyle,
                },
            },
        });
    }, [editor, editorStyle]);

    const toolbarButtons = [
        {
            label: "B",
            isActive: editor?.isActive("bold"),
            onPress: () => editor?.chain().focus().toggleBold().run(),
        },
        {
            label: "I",
            isActive: editor?.isActive("italic"),
            onPress: () => editor?.chain().focus().toggleItalic().run(),
        },
        {
            label: "U",
            isActive: editor?.isActive("underline"),
            onPress: () => editor?.chain().focus().toggleUnderline().run(),
        },
        {
            label: "S",
            isActive: editor?.isActive("strike"),
            onPress: () => editor?.chain().focus().toggleStrike().run(),
        },
        {
            label: "UL",
            isActive: editor?.isActive("bulletList"),
            onPress: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "OL",
            isActive: editor?.isActive("orderedList"),
            onPress: () => editor?.chain().focus().toggleOrderedList().run(),
        },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <View
                style={[
                    styles.editorWrapper,
                    {
                        borderColor: Colors(theme).outline,
                        backgroundColor: Colors(theme).background,
                    },
                ]}
            >
                <EditorContent editor={editor} />
                {placeholder && isEmpty ? (
                    <Text
                        pointerEvents="none"
                        style={[
                            styles.placeholder,
                            { color: Colors(theme).textSecondary },
                        ]}
                    >
                        {placeholder}
                    </Text>
                ) : null}
            </View>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
    editorWrapper: {
        minHeight: 220,
        borderWidth: 1,
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
    },
    placeholder: {
        position: "absolute",
        top: 12,
        left: 12,
        fontSize: 16,
    },
    toolbar: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderTopWidth: 1,
        marginTop: 12,
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
