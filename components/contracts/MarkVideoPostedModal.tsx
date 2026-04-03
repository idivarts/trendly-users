import Colors from "@/shared-uis/constants/Colors";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import {
    Image,
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

interface MarkVideoPostedModalProps {
    visible: boolean;
    loading?: boolean;
    proofScreenshot: string; // uploaded URL
    proofScreenshotPreviewUri?: string; // local preview (native uri / web object url)
    proofScreenshotName?: string;
    postUrl: string;
    notes: string;
    onClose: () => void;
    onPickProofScreenshot?: () => void;
    onPickProofScreenshotWeb?: (file: File) => void;
    onChangePostUrl: (value: string) => void;
    onChangeNotes: (value: string) => void;
    onSubmit: () => void;
}

const MarkVideoPostedModal: React.FC<MarkVideoPostedModalProps> = ({
    visible,
    loading = false,
    proofScreenshot,
    proofScreenshotPreviewUri,
    proofScreenshotName,
    postUrl,
    notes,
    onClose,
    onPickProofScreenshot,
    onPickProofScreenshotWeb,
    onChangePostUrl,
    onChangeNotes,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const webFileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePickProofPress = () => {
        if (Platform.OS === "web") {
            webFileInputRef.current?.click();
            return;
        }
        onPickProofScreenshot?.();
    };

    const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onPickProofScreenshotWeb?.(file);
        }
        // allow re-selecting the same file
        event.target.value = "";
    };

    const hiddenInputStyle: React.CSSProperties = useMemo(() => ({ display: "none" }), []);

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.sheet}
                onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
            >
                <Text style={styles.title}>Mark Video as Posted</Text>
                <Text style={styles.subtitle}>Add proof and post link</Text>

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
                            accept="image/*"
                            onChange={handleWebFileChange}
                            style={hiddenInputStyle}
                        />
                    ) : null}

                    <Pressable style={styles.uploadBox} onPress={handlePickProofPress}>
                        {proofScreenshotPreviewUri ? (
                            <Image
                                source={{ uri: proofScreenshotPreviewUri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.uploadContent}>
                                <FontAwesomeIcon
                                    icon={faArrowUpFromBracket}
                                    size={44}
                                    color={colors.text}
                                />
                                <Text style={styles.uploadText}>
                                    {proofScreenshotName || "Tap to upload proof screenshot"}
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <TextInput
                        label="Video Link"
                        value={postUrl}
                        onChangeText={onChangePostUrl}
                        placeholder="https://..."
                        autoCapitalize="none"
                        keyboardType="url"
                        style={styles.input}
                    />
                    <TextInput
                        label="Note (optional)"
                        value={notes}
                        onChangeText={onChangeNotes}
                        placeholder="Write your notes here..."
                        multiline
                        numberOfLines={3}
                        style={styles.linkInput}
                    />
                    <View style={styles.actions}>
                        <Button mode="outlined" style={styles.button} onPress={onClose}>
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={onSubmit}
                            disabled={loading || !postUrl.trim() || !proofScreenshot.trim()}
                        >
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
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 15,
            color: colors.text,
            marginBottom: 12,
        },
        uploadBox: {
            width: "100%",
            height: 150,
            borderRadius: 4,
            backgroundColor: colors.gray200,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            overflow: "hidden",
        },
        uploadContent: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            gap: 6,
            paddingHorizontal: 12,
        },
        uploadText: {
            color: colors.text,
            fontSize: 14,
            textAlign: "center",
        },
        previewImage: {
            width: "100%",
            height: "100%",
        },
        input: {
            marginBottom: 12,
        },
        linkInput: {
            marginBottom: 18,
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

export default MarkVideoPostedModal;
