import Colors from "@/shared-uis/constants/Colors";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
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
import { Checkbox, Modal as PaperModal, Portal } from "react-native-paper";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface ProductReceivedModalProps {
    visible: boolean;
    loading?: boolean;
    imageUri?: string;
    note: string;
    isConfirmed: boolean;
    onClose: () => void;
    onPickImage: () => void;
    onChangeNote: (value: string) => void;
    onToggleConfirm: () => void;
    onSubmit: () => void;
}

const ProductReceivedModal: React.FC<ProductReceivedModalProps> = ({
    visible,
    loading = false,
    imageUri,
    note,
    isConfirmed,
    onClose,
    onPickImage,
    onChangeNote,
    onToggleConfirm,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.sheet}
                onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
            >
                <Text style={styles.title}>Congratulation</Text>
                <Text style={styles.subtitle}>Attach a photo of the product</Text>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable style={styles.uploadBox} onPress={onPickImage}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <FontAwesomeIcon
                                icon={faArrowUpFromBracket}
                                size={44}
                                color={colors.text}
                            />
                        )}
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

                    <Pressable style={styles.checkboxRow} onPress={onToggleConfirm}>
                        <Checkbox
                            status={isConfirmed ? "checked" : "unchecked"}
                            onPress={onToggleConfirm}
                            color={colors.primary}
                        />
                        <Text style={styles.checkboxLabel}>
                            I confirm that the product is received
                        </Text>
                    </Pressable>

                    <View style={styles.actions}>
                        <Button mode="outlined" style={styles.button} onPress={onClose}>
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={onSubmit}
                            disabled={loading || !isConfirmed}
                        >
                            {loading ? "Confirming..." : "Confirm"}
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
            fontSize: 48 / 2,
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
            height: 150,
            borderRadius: 4,
            backgroundColor: colors.gray200,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            overflow: "hidden",
        },
        previewImage: {
            width: "100%",
            height: "100%",
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
        checkboxRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 22,
        },
        checkboxLabel: {
            color: colors.text,
            fontSize: 16,
            flex: 1,
            marginLeft: 8,
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

export default ProductReceivedModal;
