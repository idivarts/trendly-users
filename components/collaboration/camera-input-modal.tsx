import Button from "@/components/ui/button";
import { Console } from "@/shared-libs/utils/console";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/apply-now/gallery.styles";
import { AssetItem } from "@/types/Asset";
import { faCamera, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View
} from "react-native";
import { Text } from "react-native-paper";

interface IProps {
  isCameraVisible: boolean
  setIsCameraVisible: any
  fetchAssets: any
  setSelectedItems: any
}
const CameraInputModal: React.FC<IProps> = (props) => {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const theme = useTheme()
  const cameraRef = useRef<CameraView>(null);
  const styles = stylesFn(theme);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (!isRecording) {
      setRecordingDuration(0);
    }
  }, [isRecording]);


  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        try {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);

          const newItem: AssetItem = {
            id: asset.id.toString(),
            localUri: asset.uri,
            type: "image",
            uri: asset.uri,
          };
          props.setSelectedItems((prev: AssetItem[]) => [...prev, newItem]);

          // Fetch the updated assets from the library
          props.fetchAssets();
          props.setIsCameraVisible(false);
        } catch (error) {
          Console.error(error);
        }
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();

        if (video?.uri) {
          setIsSaving(true);
          const asset = await MediaLibrary.createAssetAsync(video.uri);

          if (
            asset.mediaType === MediaLibrary.MediaType.video &&
            asset.duration <= 0
          ) {
            Toaster.error("Video too short - please record longer");
            return;
          }

          const newItem: AssetItem = {
            id: asset.id.toString(),
            localUri: asset.uri,
            type:
              asset.mediaType === MediaLibrary.MediaType.video
                ? "video"
                : "image",
            uri: asset.uri,
          };

          props.setSelectedItems((prev: any) => [...prev, newItem]);
          await props.fetchAssets();
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        if (
          errorMessage.includes(
            "Recording was stopped before any data could be produced"
          )
        ) {
          Toaster.error("Please hold the record button longer");
        } else {
          Toaster.error("Failed to save video");
        }
      } finally {
        setIsRecording(false);
        setIsSaving(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        Console.error(error);
      } finally {
        setIsRecording(false);
        props.setIsCameraVisible(false);
      }
    }
  };
  // Add this helper function to format the duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Modal visible={props.isCameraVisible} animationType="slide">
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="back"
        onCameraReady={() => { }}
        mode="video"
      >
        {isRecording ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {formatDuration(recordingDuration)}
            </Text>
          </View>
        ) : null}
        <View style={styles.cameraButtons}>
          <Button
            mode="contained"
            icon={() => (
              <FontAwesomeIcon
                icon={faCamera}
                size={16}
                color={Colors(theme).white}
              />
            )}
            onPress={async () => {
              await takePhoto();
            }}
            disabled={isRecording}
          >
            Capture Photo
          </Button>
          <Button
            mode="contained"
            icon={() => (
              <FontAwesomeIcon
                icon={faVideo}
                size={16}
                color={Colors(theme).white}
              />
            )}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button mode="contained" onPress={() => props.setIsCameraVisible(false)}>
            Close
          </Button>
        </View>
      </CameraView>
    </Modal>
  )
}

export default CameraInputModal