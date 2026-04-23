import { state5SubmitDeliverable } from "./api/VideoPending_api";
import type { AssetItem } from "@/shared-libs/types/Asset";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
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

interface SubmitVideoModalProps {
    visible: boolean;
    loading?: boolean;
    selectedVideoName?: string;
    note: string;
    uploadProgress?: number;
    isUploading?: boolean;
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
    uploadProgress = 0,
    isUploading = false,
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
    const webFileHiddenStyle: React.CSSProperties = useMemo(() => ({ display: "none" }), []);
    const uploadForegroundColor = selectedVideoName ? colors.text : colors.textSecondary;
    const effectiveOnClose = isUploading ? () => undefined : onClose;

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
                style={styles.inner}
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
                            style={webFileHiddenStyle}
                        />
                    ) : null}
                    <Pressable style={styles.uploadBox} onPress={handlePickVideoPress}>
                        <View style={styles.uploadContent}>
                            <FontAwesomeIcon icon={faArrowUpFromBracket} size={44} color={uploadForegroundColor} />
                            <Text
                                style={[
                                    styles.uploadText,
                                    selectedVideoName ? styles.uploadTextSelected : styles.uploadTextPlaceholder,
                                ]}
                            >
                                {selectedVideoName || "Tap to select video"}
                            </Text>
                        </View>
                    </Pressable>

                    {isUploading ? (
                        <View style={styles.uploadProgressCard}>
                            <View style={styles.uploadProgressHeader}>
                                <Text style={styles.uploadProgressTitle}>Uploading video</Text>
                                <Text style={styles.uploadProgressPercent}>{Math.round(uploadProgress || 0)}%</Text>
                            </View>
                            <ProgressBar
                                progress={Math.min(1, Math.max(0, (uploadProgress || 0) / 100))}
                                color={colors.primary}
                                style={styles.uploadProgressBar}
                            />
                            <Text style={styles.uploadProgressHint}>
                                The Video is getting uploaded please don't close the app until the video is uploaded
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

                    <View style={styles.actions}>
                        <Button mode="outlined" style={styles.button} onPress={effectiveOnClose} disabled={loading || isUploading}>
                            Cancel
                        </Button>
                        <Button mode="contained" style={styles.button} onPress={onSubmit} disabled={loading || isUploading}>
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
            snapPointsRange={["50%", "90%"]}
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
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
        },
        uploadContent: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.transparent,
            gap: 6,
        },
        uploadText: {
            fontSize: 14,
        },
        uploadTextPlaceholder: {
            color: colors.textSecondary,
        },
        uploadTextSelected: {
            color: colors.text,
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

export type SubmitVideoModalRunWithRefresh = (
    fn: () => Promise<void>,
    successMessage: string
) => Promise<void>;

export function useSubmitVideoModal(options: {
    contractId: string;
    runWithRefresh: SubmitVideoModalRunWithRefresh;
}) {
    const { contractId, runWithRefresh } = options;
    const { getBlob } = useAWSContext();
    const [visible, setVisible] = useState(false);
    const [submitVideoNote, setSubmitVideoNote] = useState("");
    const [selectedVideoName, setSelectedVideoName] = useState("");
    const [selectedVideoUri, setSelectedVideoUri] = useState("");
    const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const open = useCallback(() => setVisible(true), []);

    const close = useCallback(() => {
        setVisible(false);
        setSubmitVideoNote("");
        setSelectedVideoName("");
        setSelectedVideoUri("");
        setSelectedVideoFile(null);
        setUploadProgress(0);
        setIsUploading(false);
    }, []);

    const pickSubmitVideo = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload video.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]) {
            const pickedName = result.assets[0].fileName || "Video selected";
            setSelectedVideoName(pickedName);
            setSelectedVideoUri(result.assets[0].uri || "");
        }
    }, []);

    const onPickVideoWeb = useCallback((file: File) => {
        setSelectedVideoFile(file);
        setSelectedVideoName(file.name || "Video selected");
        setSelectedVideoUri("");
    }, []);

    const handleSubmit = useCallback(
        () =>
            runWithRefresh(
                async () => {
                    let progressSub: Subscription | undefined;
                    const progressSubject = new Subject<{ index: number; percentage: number }>();

                    const isWeb = Platform.OS === "web";
                    if (isWeb) {
                        if (!selectedVideoFile) {
                            throw new Error("Please select a video before submitting.");
                        }
                    } else {
                        if (!selectedVideoUri) {
                            throw new Error("Please select a video before submitting.");
                        }
                    }

                    try {
                        setIsUploading(true);
                        setUploadProgress(0);

                        progressSub = progressSubject.subscribe(({ percentage }) => {
                            const safe = Number.isFinite(percentage) ? Math.round(percentage) : 0;
                            setUploadProgress(Math.max(0, Math.min(100, safe)));
                        });

                        // Convert selected video into a Blob/File using AWS helper.
                        progressSubject.next({ index: 0, percentage: 10 });
                        const videoType = "video/mp4";
                        const normalizedName =
                            (selectedVideoName || "video.mp4").includes(".")
                                ? selectedVideoName || "video.mp4"
                                : `${selectedVideoName || "video"}.mp4`;

                        const videoPayload: Blob | File = isWeb
                            ? (selectedVideoFile as File)
                            : await getBlob({
                                  id: selectedVideoUri,
                                  localUri: selectedVideoUri,
                                  uri: selectedVideoUri,
                                  type: "video",
                              } as AssetItem);

                        progressSubject.next({ index: 0, percentage: 60 });

                        await state5SubmitDeliverable({
                            contractId,
                            video: videoPayload,
                            videoName: normalizedName,
                            videoType,
                            note: submitVideoNote.trim() || undefined,
                        });
                        close();
                        setUploadProgress(100);
                    } finally {
                        progressSub?.unsubscribe();
                        progressSubject.complete();
                        setIsUploading(false);
                    }
                },
                "Video submitted for review."
            ),
        [
            selectedVideoFile,
            selectedVideoUri,
            submitVideoNote,
            contractId,
            getBlob,
            runWithRefresh,
            close,
        ]
    );

    const submitVideoModalProps = useMemo(
        () => ({
            visible,
            selectedVideoName,
            note: submitVideoNote,
            uploadProgress,
            isUploading,
            onClose: close,
            onPickVideo: pickSubmitVideo,
            onPickVideoWeb,
            onChangeNote: setSubmitVideoNote,
            onSubmit: handleSubmit,
        }),
        [
            visible,
            selectedVideoName,
            submitVideoNote,
            uploadProgress,
            isUploading,
            close,
            pickSubmitVideo,
            onPickVideoWeb,
            handleSubmit,
        ]
    );

    return { open, submitVideoModalProps };
}
