import { state4MarkProductReceived } from "./api/DeliveryPending_api";
import type { AssetItem } from "@/shared-libs/types/Asset";
import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Checkbox, ProgressBar } from "react-native-paper";
import { Subject, type Subscription } from "rxjs";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import ContractActionOverlay from "./ContractActionOverlay";

interface ProductReceivedModalProps {
    visible: boolean;
    loading?: boolean;
    imageUri?: string;
    note: string;
    isConfirmed: boolean;
    uploadProgress?: number;
    isUploading?: boolean;
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
    uploadProgress = 0,
    isUploading = false,
    onClose,
    onPickImage,
    onChangeNote,
    onToggleConfirm,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const uploadForegroundColor = imageUri ? colors.text : colors.textSecondary;
    const effectiveOnClose = isUploading ? () => undefined : onClose;

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.inner}
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
                                color={uploadForegroundColor}
                            />
                        )}
                    </Pressable>

                    {isUploading ? (
                        <View style={styles.uploadProgressCard}>
                            <View style={styles.uploadProgressHeader}>
                                <Text style={styles.uploadProgressTitle}>Uploading product photo</Text>
                                <Text style={styles.uploadProgressPercent}>{Math.round(uploadProgress || 0)}%</Text>
                            </View>
                            <ProgressBar
                                progress={Math.min(1, Math.max(0, (uploadProgress || 0) / 100))}
                                color={colors.primary}
                                style={styles.uploadProgressBar}
                            />
                            <Text style={styles.uploadProgressHint}>
                                The photo is getting uploaded. Please don't close the app until it finishes.
                            </Text>
                        </View>
                    ) : null}

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
                        <Button
                            mode="outlined"
                            style={styles.button}
                            onPress={effectiveOnClose}
                            disabled={loading || isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={onSubmit}
                            disabled={loading || isUploading || !isConfirmed}
                        >
                            {loading || isUploading ? "Confirming..." : "Confirm"}
                        </Button>
                    </View>
                </ScrollView>
            </Pressable>
        </KeyboardAvoidingView>
    );

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={effectiveOnClose}
            mode="auto"
            snapPointsRange={["96%", "96%"]}
            modalMaxWidth={520}
        >
            <View style={styles.contentShell}>{modalContent}</View>
        </ContractActionOverlay>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        contentShell: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28,
        },
        keyboardView: {
            flex: 1,
            width: "100%",
        },
        inner: {
            flex: 1,
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
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
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
        uploadProgressCard: {
            width: "100%",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
            marginBottom: 12,
            gap: 8,
        },
        uploadProgressHeader: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        uploadProgressTitle: {
            color: colors.text,
            fontSize: 14,
            fontWeight: "600",
        },
        uploadProgressPercent: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: "600",
        },
        uploadProgressBar: {
            height: 8,
            borderRadius: 99,
            backgroundColor: colors.secondaryBorder,
        },
        uploadProgressHint: {
            color: colors.textSecondary,
            fontSize: 12,
            lineHeight: 16,
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

export type ProductReceivedModalRunWithRefresh = (
    fn: () => Promise<void>,
    successMessage: string
) => Promise<void>;

export function useProductReceivedModal(options: {
    contractId: string;
    uploadFileUri: (
        fileUri: AssetItem,
        subject?: { index: number; subject: Subject<{ index: number; percentage: number }> }
    ) => Promise<{ imageUrl?: string }>;
    runWithRefresh: ProductReceivedModalRunWithRefresh;
}) {
    const { contractId, uploadFileUri, runWithRefresh } = options;
    const [visible, setVisible] = useState(false);
    const [receivedImageUri, setReceivedImageUri] = useState("");
    const [receivedNote, setReceivedNote] = useState("");
    const [receivedConfirmed, setReceivedConfirmed] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const open = useCallback(() => setVisible(true), []);

    const close = useCallback(() => {
        setVisible(false);
        setReceivedImageUri("");
        setReceivedNote("");
        setReceivedConfirmed(false);
        setUploadProgress(0);
        setIsUploading(false);
    }, []);

    const pickReceivedProductImage = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload image.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            setReceivedImageUri(result.assets[0].uri);
        }
    }, []);

    const handleSubmit = useCallback(
        () =>
            runWithRefresh(
                async () => {
                    if (!receivedImageUri) {
                        throw new Error("Please attach a product image before confirming.");
                    }
                    if (!receivedConfirmed) {
                        throw new Error("Please confirm that the product is received.");
                    }
                    let progressSub: Subscription | undefined;
                    const progressSubject = new Subject<{ index: number; percentage: number }>();
                    try {
                        setIsUploading(true);
                        setUploadProgress(0);
                        progressSub = progressSubject.subscribe(({ percentage }) => {
                            const safe = Number.isFinite(percentage) ? Math.round(percentage) : 0;
                            setUploadProgress(Math.max(0, Math.min(100, safe)));
                        });

                        const uploadedImage = await uploadFileUri(
                            {
                                id: receivedImageUri,
                                localUri: receivedImageUri,
                                uri: receivedImageUri,
                                type: "image",
                            } as AssetItem,
                            { index: 0, subject: progressSubject }
                        );
                        setUploadProgress(100);
                        const photoUrl = uploadedImage.imageUrl;
                        if (!photoUrl) {
                            throw new Error("Image upload failed. Please try again.");
                        }
                        await state4MarkProductReceived({
                            contractId,
                            photoUrl,
                            notes: receivedNote.trim() || undefined,
                        });
                        close();
                    } finally {
                        progressSub?.unsubscribe();
                        progressSubject.complete();
                        setIsUploading(false);
                    }
                },
                "Marked as product received."
            ),
        [receivedImageUri, receivedConfirmed, receivedNote, contractId, uploadFileUri, runWithRefresh, close]
    );

    const productReceivedModalProps = useMemo(
        () => ({
            visible,
            imageUri: receivedImageUri,
            note: receivedNote,
            isConfirmed: receivedConfirmed,
            uploadProgress,
            isUploading,
            onClose: close,
            onPickImage: pickReceivedProductImage,
            onChangeNote: setReceivedNote,
            onToggleConfirm: () => setReceivedConfirmed((prev) => !prev),
            onSubmit: handleSubmit,
        }),
        [
            visible,
            receivedImageUri,
            receivedNote,
            receivedConfirmed,
            uploadProgress,
            isUploading,
            close,
            pickReceivedProductImage,
            handleSubmit,
        ]
    );

    return { open, productReceivedModalProps };
}
