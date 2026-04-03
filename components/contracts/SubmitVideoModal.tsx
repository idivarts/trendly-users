import Colors from "@/shared-uis/constants/Colors";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal as RNModal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Modal as PaperModal, Portal } from "react-native-paper";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface SubmitVideoModalProps {
    visible: boolean;
    loading?: boolean;
    selectedVideoName?: string;
    note: string;
    onClose: () => void;
    onPickVideo?: () => void;
    onPickVideoWeb?: (file: File) => void;
    onChangeNote: (value: string) => void;
    onSubmit: () => void;
}

const SubmitVideoModal: React.FC<SubmitVideoModalProps> = ({
    visible,
    loading = false,
    selectedVideoName,
    note,
    onClose,
    onPickVideo,
    onPickVideoWeb,
    onChangeNote,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const webFileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePickVideoPress = () => {
        if (Platform.OS === "web") {
            webFileInputRef.current?.click();
            return;
        }
        onPickVideo?.();
    };

    const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onPickVideoWeb?.(file);
        }
        // allow re-selecting the same file
        event.target.value = "";
    };

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.sheet}
                onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
            >
                <Text style={styles.title}>Upload Video</Text>
                <Text style={styles.subtitle}>Attach your video file</Text>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {Platform.OS === "web" ? (
                        <input
                            ref={webFileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleWebFileChange}
                            style={{ display: "none" }}
                        />
                    ) : null}
                    <Pressable style={styles.uploadBox} onPress={handlePickVideoPress}>
                        <View style={styles.uploadContent}>
                            <FontAwesomeIcon icon={faArrowUpFromBracket} size={44} color={colors.text} />
                            <Text style={styles.uploadText}>
                                {selectedVideoName || "Tap to select video"}
                            </Text>
                        </View>
                    </Pressable>

                    <TextInput
                        label="Note"
                        value={note}
                        onChangeText={onChangeNote}
                        placeholder="Write your notes here..."
                        multiline
                        numberOfLines={3}
                        style={styles.noteInput}
                    />
                    <Text style={styles.helperText}>Supporting text</Text>

                    <View style={styles.actions}>
                        <Button mode="outlined" style={styles.button} onPress={onClose}>
                            Cancel
                        </Button>
                        <Button mode="contained" style={styles.button} onPress={onSubmit} disabled={loading}>
                            {loading ? "Submitting..." : "Confirm"}
                        </Button>
                    </View>
                </ScrollView>
            </Pressable>
        </KeyboardAvoidingView>
    );

    if (Platform.OS !== "web") {
        return (
            <RNModal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>{modalContent}</View>
            </RNModal>
        );
    }

    return (
        <Portal>
            <PaperModal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={styles.modalContainer}
            >
                {modalContent}
            </PaperModal>
        </Portal>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    const isNative = Platform.OS !== "web";
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.backdrop,
            justifyContent: "flex-end",
        },
        modalContainer: {
            backgroundColor: colors.background,
            borderRadius: 20,
            marginHorizontal: 12,
            maxWidth: 560,
            alignSelf: "center",
            width: "95%",
        },
        keyboardView: {
            width: "100%",
            ...(isNative ? { maxHeight: "90%" } : {}),
        },
        sheet: {
            backgroundColor: colors.background,
            borderTopLeftRadius: isNative ? 28 : 20,
            borderTopRightRadius: isNative ? 28 : 20,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            width: "100%",
        },
        scrollView: { width: "100%" },
        scrollContent: { paddingBottom: 8 },
        title: {
            fontSize: 40 / 2,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 16,
        },
        subtitle: {
            fontSize: 18 / 1.1,
            color: colors.text,
            marginBottom: 12,
        },
        uploadBox: {
            width: "100%",
            height: 130,
            borderRadius: 4,
            backgroundColor: colors.gray200,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
        },
        uploadContent: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            gap: 6,
        },
        uploadText: {
            color: colors.text,
            fontSize: 14,
        },
        noteInput: {
            marginTop: 4,
            minHeight: 86,
        },
        helperText: {
            marginTop: 6,
            marginBottom: 12,
            color: colors.gray300,
            fontSize: 14,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
        },
        button: {
            minWidth: 120,
        },
    });
}

export default SubmitVideoModal;
