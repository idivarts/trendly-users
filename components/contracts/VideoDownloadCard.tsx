import { Text, View } from "@/components/theme/Themed";
import { Console } from "@/shared-libs/utils/console";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faDownload, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet } from "react-native";
import Button from "../ui/button";

interface VideoDownloadCardProps {
    videoUrl: string;
    showDownload?: boolean;
}

const VideoDownloadCard: React.FC<VideoDownloadCardProps> = ({
    videoUrl,
    showDownload = true,
}) => {
    const theme = useTheme();
    const [downloading, setDownloading] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const handleDownload = async () => {
        try {
            setDownloading(true);

            if (Platform.OS === "web") {
                // For web, open in new tab
                window.open(videoUrl, "_blank");
                Toaster.success("Video opened in new tab");
            } else {
                // For mobile, download and share using native URL handler
                const filename = `video_${Date.now()}.mp4`;
                const file = new File(Paths.cache, filename);

                // Create empty file first
                file.create({ overwrite: true });

                // Fetch blob from URL
                const response = await fetch(videoUrl);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();

                // Write blob to file
                await file.write(new Uint8Array(buffer));

                if (file.uri) {
                    const canShare = await Sharing.isAvailableAsync();
                    if (canShare) {
                        await Sharing.shareAsync(file.uri);
                        Toaster.success("Video downloaded successfully");
                    } else {
                        Toaster.success("Video saved to device");
                    }
                }
            }
        } catch (error) {
            Console.error("Error downloading video:", String(error));
            Toaster.error("Failed to download video");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.card,
                    { backgroundColor: Colors(theme).gray200, borderColor: Colors(theme).gray300 },
                ]}
            >
                {showVideo ? (
                    <Video
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                    />
                ) : (
                    <Pressable style={styles.placeholder} onPress={() => setShowVideo(true)}>
                        <View
                            style={[
                                styles.playButton,
                                { backgroundColor: Colors(theme).primary },
                            ]}
                        >
                            <FontAwesomeIcon icon={faPlay} size={24} color="#fff" />
                        </View>
                        <Text style={styles.placeholderText}>Tap to play video</Text>
                    </Pressable>
                )}

                {showDownload && (
                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            onPress={handleDownload}
                            disabled={downloading}
                            style={styles.downloadButton}
                        >
                            {downloading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color={Colors(theme).primary} />
                                    <Text style={styles.downloadingText}>Downloading...</Text>
                                </View>
                            ) : (
                                <View style={styles.buttonContent}>
                                    <FontAwesomeIcon
                                        icon={faDownload}
                                        size={16}
                                        color={Colors(theme).primary}
                                    />
                                    <Text style={{ color: Colors(theme).primary }}>
                                        Download Video
                                    </Text>
                                </View>
                            )}
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 16,
    },
    video: {
        width: "100%",
        height: 300,
        borderRadius: 8,
        backgroundColor: "#000",
    },
    placeholder: {
        width: "100%",
        height: 300,
        borderRadius: 8,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#fff",
        fontSize: 14,
    },
    actions: {
        width: "100%",
    },
    downloadButton: {
        width: "100%",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    downloadingText: {
        fontSize: 14,
    },
});

export default VideoDownloadCard;
