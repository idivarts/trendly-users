import { Text, View } from "@/components/theme/Themed";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { Console } from "@/shared-libs/utils/console";
import { StorageApp } from "@/shared-libs/utils/firebase/firebase-storage";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faClose, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import Button from "../ui/button";

interface VideoUploadModalProps {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    contract: IContracts;
    refreshData: () => void;
    isReupload?: boolean;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
    visible,
    setVisibility,
    contract,
    refreshData,
    isReupload = false,
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [videoSize, setVideoSize] = useState<number>(0);
    const [uploadProgress, setUploadProgress] = useState(0);

    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

    const pickVideo = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Toaster.error("Media library permissions required");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];

                // Check file size (estimate from duration if not available)
                const estimatedSize = asset.duration ? asset.duration * 1024 * 100 : 0; // rough estimate

                if (estimatedSize > MAX_FILE_SIZE) {
                    Toaster.error("Video file is too large. Maximum size is 500MB");
                    return;
                }

                setVideoUri(asset.uri);
                setVideoSize(estimatedSize);
            }
        } catch (error) {
            Console.error("Error picking video:", String(error));
            Toaster.error("Failed to pick video");
        }
    };

    const handleUploadVideo = async () => {
        try {
            if (!videoUri) {
                Toaster.error("Please select a video first");
                return;
            }

            setLoading(true);
            setUploadProgress(10);

            // Fetch video as blob
            const response = await fetch(videoUri);
            const blob = await response.blob();

            setUploadProgress(30);

            // Upload to Firebase Storage
            const timestamp = Date.now();
            const storageRef = ref(
                StorageApp,
                `/contracts/${contract.streamChannelId}/videos/${timestamp}.mp4`
            );

            await uploadBytes(storageRef, blob);
            setUploadProgress(70);

            const downloadURL = await getDownloadURL(storageRef);
            setUploadProgress(90);

            // Update contract document
            const contractRef = doc(FirestoreDB, "contracts", contract.streamChannelId);
            await updateDoc(contractRef, {
                status: 7,
                videoUrl: downloadURL,
                videoSubmittedAt: Date.now(),
            });

            setUploadProgress(100);
            Toaster.success(
                isReupload
                    ? "Video reuploaded successfully"
                    : "Video uploaded successfully"
            );
            setVisibility(false);
            refreshData();
        } catch (error) {
            Console.error("Error uploading video:", String(error));
            Toaster.error("Failed to upload video");
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => !loading && setVisibility(false)}
                contentContainerStyle={{
                    backgroundColor: Colors(theme).background,
                    borderRadius: 10,
                    padding: 20,
                    marginHorizontal: 20,
                    maxWidth: 600,
                    alignSelf: "center",
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Pressable
                            style={styles.modal}
                            onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {isReupload ? "Reupload Video" : "Upload Video"}
                                </Text>
                                {!loading && (
                                    <Pressable onPress={() => setVisibility(false)}>
                                        <FontAwesomeIcon
                                            icon={faClose}
                                            size={24}
                                            color={Colors(theme).text}
                                        />
                                    </Pressable>
                                )}
                            </View>

                            <View style={styles.content}>
                                {videoUri ? (
                                    <View style={styles.videoInfo}>
                                        <View style={styles.videoIconContainer}>
                                            <FontAwesomeIcon
                                                icon={faVideo}
                                                size={48}
                                                color={Colors(theme).primary}
                                            />
                                        </View>
                                        <Text style={styles.videoSelected}>Video Selected</Text>
                                        <Text style={styles.videoSize}>
                                            Size: {formatFileSize(videoSize)}
                                        </Text>
                                        {!loading && (
                                            <Pressable
                                                style={styles.changeVideoButton}
                                                onPress={pickVideo}
                                            >
                                                <Text style={styles.changeVideoText}>
                                                    Select Different Video
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                ) : (
                                    <Pressable style={styles.uploadButton} onPress={pickVideo}>
                                        <FontAwesomeIcon
                                            icon={faVideo}
                                            size={64}
                                            color={Colors(theme).primary}
                                        />
                                        <Text style={styles.uploadText}>Select Video</Text>
                                        <Text style={styles.uploadSubtext}>
                                            Maximum file size: 500MB
                                        </Text>
                                    </Pressable>
                                )}

                                {loading && (
                                    <View style={styles.progressContainer}>
                                        <ActivityIndicator
                                            size="large"
                                            color={Colors(theme).primary}
                                        />
                                        <Text style={styles.progressText}>
                                            Uploading... {uploadProgress}%
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setVisibility(false)}
                                    style={styles.button}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleUploadVideo}
                                    style={styles.button}
                                    loading={loading}
                                    disabled={loading || !videoUri}
                                >
                                    Upload
                                </Button>
                            </View>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    modal: {
        gap: 20,
        width: "100%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    content: {
        minHeight: 200,
        justifyContent: "center",
        width: "100%",
    },
    uploadButton: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderRadius: 8,
        padding: 48,
        alignItems: "center",
        gap: 12,
    },
    uploadText: {
        fontSize: 18,
        fontWeight: "600",
    },
    uploadSubtext: {
        fontSize: 14,
        opacity: 0.7,
    },
    videoInfo: {
        alignItems: "center",
        gap: 12,
    },
    videoIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    videoSelected: {
        fontSize: 18,
        fontWeight: "600",
    },
    videoSize: {
        fontSize: 14,
        opacity: 0.7,
    },
    changeVideoButton: {
        marginTop: 8,
        padding: 8,
    },
    changeVideoText: {
        fontSize: 14,
        textDecorationLine: "underline",
    },
    progressContainer: {
        alignItems: "center",
        gap: 12,
        marginTop: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: "600",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
    },
});

export default VideoUploadModal;
