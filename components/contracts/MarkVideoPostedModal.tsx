import { state8SubmitPosting } from "./api/PostingPending_api";
import type { AssetItem } from "@/shared-libs/types/Asset";
import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ProgressBar } from "react-native-paper";
import { Subject, type Subscription } from "rxjs";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import ContractActionOverlay from "./ContractActionOverlay";

interface MarkVideoPostedModalProps {
    visible: boolean;
    loading?: boolean;
    proofScreenshot: string; // uploaded URL
    proofScreenshotPreviewUri?: string; // local preview (native uri / web object url)
    proofScreenshotName?: string;
    postUrl: string;
    notes: string;
    uploadProgress?: number;
    isUploading?: boolean;
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
    uploadProgress = 0,
    isUploading = false,
    onClose,
    onPickProofScreenshot,
    onPickProofScreenshotWeb,
    onChangePostUrl,
    onChangeNotes,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const webFileInputRef = useRef<HTMLInputElement | null>(null);
    const effectiveOnClose = isUploading ? () => undefined : onClose;

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
                style={styles.inner}
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
                                <FontAwesomeIcon icon={faArrowUpFromBracket} size={44} color={colors.text} />
                                <Text style={styles.uploadText}>
                                    {proofScreenshotName || "Tap to upload proof screenshot"}
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    {isUploading ? (
                        <View style={styles.uploadProgressCard}>
                            <View style={styles.uploadProgressHeader}>
                                <Text style={styles.uploadProgressTitle}>Uploading proof screenshot</Text>
                                <Text style={styles.uploadProgressPercent}>{Math.round(uploadProgress || 0)}%</Text>
                            </View>
                            <ProgressBar
                                progress={Math.min(1, Math.max(0, (uploadProgress || 0) / 100))}
                                color={colors.primary}
                                style={styles.uploadProgressBar}
                            />
                            <Text style={styles.uploadProgressHint}>
                                The screenshot is getting uploaded. Please don't close the app until it finishes.
                            </Text>
                        </View>
                    ) : null}

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
                        <Button mode="outlined" style={styles.button} onPress={effectiveOnClose} disabled={loading || isUploading}>
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={onSubmit}
                            disabled={loading || isUploading || !postUrl.trim() || !proofScreenshot.trim()}
                        >
                            {loading || isUploading ? "Submitting..." : "Confirm"}
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
            snapPointsRange={["55%", "92%"]}
            modalMaxWidth={520}
        >
            <View style={styles.contentShell}>{modalContent}</View>
        </ContractActionOverlay>
    );
};

function createStyles(theme: ReturnType<typeof useTheme>) {
    const colors = Colors(theme);
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
            backgroundColor: theme.dark ? colors.modalBackground : colors.gray200,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            overflow: "hidden",
        },
        uploadContent: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.transparent,
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

export type MarkVideoPostedModalRunWithRefresh = (
    fn: () => Promise<void>,
    successMessage: string
) => Promise<void>;

export function useMarkVideoPostedModal(options: {
    contractId: string;
    uploadFile: (
        file: File,
        subject?: { index: number; subject: Subject<{ index: number; percentage: number }> }
    ) => Promise<{ imageUrl?: string }>;
    uploadFileUri: (
        fileUri: AssetItem,
        subject?: { index: number; subject: Subject<{ index: number; percentage: number }> }
    ) => Promise<{ imageUrl?: string }>;
    runWithRefresh: MarkVideoPostedModalRunWithRefresh;
    setActionLoading: (loading: boolean) => void;
}) {
    const { contractId, uploadFile, uploadFileUri, runWithRefresh, setActionLoading } = options;
    const [visible, setVisible] = useState(false);
    const [postedVideoLink, setPostedVideoLink] = useState("");
    const [postedProofScreenshot, setPostedProofScreenshot] = useState("");
    const [postedProofScreenshotPreviewUri, setPostedProofScreenshotPreviewUri] = useState("");
    const [postedProofScreenshotName, setPostedProofScreenshotName] = useState("");
    const [postedNotes, setPostedNotes] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const postingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const postingInFlightRef = useRef(false);

    const open = useCallback(() => setVisible(true), []);

    const close = useCallback(() => {
        setVisible(false);
        setPostedVideoLink("");
        setPostedProofScreenshot("");
        setPostedProofScreenshotPreviewUri("");
        setPostedProofScreenshotName("");
        setPostedNotes("");
        setUploadProgress(0);
        setIsUploading(false);
    }, []);

    useEffect(() => {
        return () => {
            if (postedProofScreenshotPreviewUri && postedProofScreenshotPreviewUri.startsWith("blob:")) {
                URL.revokeObjectURL(postedProofScreenshotPreviewUri);
            }
        };
    }, [postedProofScreenshotPreviewUri]);

    useEffect(() => {
        return () => {
            if (postingDebounceRef.current) {
                clearTimeout(postingDebounceRef.current);
            }
        };
    }, []);

    const pickProofScreenshotImage = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload image.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            const localUri = result.assets[0].uri;
            setPostedProofScreenshotPreviewUri(localUri);
            setPostedProofScreenshotName(result.assets[0].fileName || "Screenshot selected");
            setActionLoading(true);
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
                        id: localUri,
                        localUri,
                        uri: localUri,
                        type: "image",
                    } as AssetItem,
                    { index: 0, subject: progressSubject }
                );
                const imageUrl = uploadedImage.imageUrl;
                if (!imageUrl) {
                    throw new Error("Image upload failed. Please try again.");
                }
                setPostedProofScreenshot(imageUrl);
                setUploadProgress(100);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Failed to upload proof screenshot.";
                setPostedProofScreenshot("");
                setPostedProofScreenshotPreviewUri("");
                setPostedProofScreenshotName("");
                Toaster.error(message);
            } finally {
                progressSub?.unsubscribe();
                progressSubject.complete();
                setIsUploading(false);
                setActionLoading(false);
            }
        }
    }, [uploadFileUri, setActionLoading]);

    const pickProofScreenshotWeb = useCallback(
        async (file: File) => {
            const objectUrl = URL.createObjectURL(file);
            setPostedProofScreenshotPreviewUri((prev) => {
                if (prev.startsWith("blob:")) {
                    URL.revokeObjectURL(prev);
                }
                return objectUrl;
            });
            setPostedProofScreenshotName(file.name || "Screenshot selected");
            setPostedProofScreenshot("");
            setActionLoading(true);
            let progressSub: Subscription | undefined;
            const progressSubject = new Subject<{ index: number; percentage: number }>();
            try {
                setIsUploading(true);
                setUploadProgress(0);
                progressSub = progressSubject.subscribe(({ percentage }) => {
                    const safe = Number.isFinite(percentage) ? Math.round(percentage) : 0;
                    setUploadProgress(Math.max(0, Math.min(100, safe)));
                });

                const uploadedImage = await uploadFile(file, { index: 0, subject: progressSubject });
                const imageUrl = uploadedImage.imageUrl;
                if (!imageUrl) {
                    throw new Error("Image upload failed. Please try again.");
                }
                setPostedProofScreenshot(imageUrl);
                setUploadProgress(100);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Failed to upload proof screenshot.";
                setPostedProofScreenshot("");
                setPostedProofScreenshotPreviewUri("");
                setPostedProofScreenshotName("");
                Toaster.error(message);
            } finally {
                progressSub?.unsubscribe();
                progressSubject.complete();
                setIsUploading(false);
                setActionLoading(false);
            }
        },
        [uploadFile, setActionLoading]
    );

    const handleMarkPostedSubmit = useCallback(
        () =>
            runWithRefresh(
                async () => {
                    if (!postedVideoLink.trim()) throw new Error("Please add the posted video link.");
                    if (!postedProofScreenshot.trim()) throw new Error("Please add the proof screenshot.");
                    await state8SubmitPosting({
                        contractId,
                        proofScreenshot: postedProofScreenshot.trim(),
                        postUrl: postedVideoLink.trim(),
                        notes: postedNotes.trim() || undefined,
                    });
                    close();
                },
                "Marked as posted."
            ),
        [postedVideoLink, postedProofScreenshot, postedNotes, contractId, runWithRefresh, close]
    );

    const submitPostingWithDebounce = useCallback(async () => {
        if (postingInFlightRef.current || postingDebounceRef.current) return;
        postingInFlightRef.current = true;
        postingDebounceRef.current = setTimeout(() => {
            postingDebounceRef.current = null;
        }, 1500);
        try {
            await handleMarkPostedSubmit();
        } finally {
            postingInFlightRef.current = false;
        }
    }, [handleMarkPostedSubmit]);

    const markVideoPostedModalProps = useMemo(
        () => ({
            visible,
            proofScreenshot: postedProofScreenshot,
            proofScreenshotPreviewUri: postedProofScreenshotPreviewUri,
            proofScreenshotName: postedProofScreenshotName,
            postUrl: postedVideoLink,
            notes: postedNotes,
            uploadProgress,
            isUploading,
            onClose: close,
            onPickProofScreenshot: pickProofScreenshotImage,
            onPickProofScreenshotWeb: pickProofScreenshotWeb,
            onChangePostUrl: setPostedVideoLink,
            onChangeNotes: setPostedNotes,
            onSubmit: submitPostingWithDebounce,
        }),
        [
            visible,
            postedProofScreenshot,
            postedProofScreenshotPreviewUri,
            postedProofScreenshotName,
            postedVideoLink,
            postedNotes,
            uploadProgress,
            isUploading,
            close,
            pickProofScreenshotImage,
            pickProofScreenshotWeb,
            submitPostingWithDebounce,
        ]
    );

    return { open, markVideoPostedModalProps };
}
