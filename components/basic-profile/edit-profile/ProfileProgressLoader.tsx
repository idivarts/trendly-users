import React from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";

interface ProgressLoaderProps {
    isProcessing: boolean;
    progress: number; // Progress percentage (0 to 100)
}

const ProfileProgressLoader: React.FC<ProgressLoaderProps> = ({ isProcessing, progress }) => {
    const animatedWidth = new Animated.Value(progress);

    React.useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 500, // Smooth transition
            useNativeDriver: false,
        }).start();
    }, [progress]);

    if (!isProcessing) return null;

    return (
        <Modal transparent={true} animationType="fade" visible={isProcessing}>
            <View style={styles.modalContainer}>
                <View style={styles.loaderBox}>
                    <Text style={styles.loadingText}>Processing... {progress}%</Text>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%` }, // Animated width based on progress
                            ]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        width: 250,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    progressBar: {
        width: "100%",
        height: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#3498db",
    },
});

export default ProfileProgressLoader;