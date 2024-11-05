import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Appbar, Button, Surface, Text, Checkbox } from "react-native-paper";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraPictureOptions,
  Camera,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { stylesFn } from "@/styles/apply-now/gallery.styles";
import { useTheme } from "@react-navigation/native";

const GalleryScreen = () => {
  const { pageID } = useLocalSearchParams();
  const [photos, setPhotos] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const note = useLocalSearchParams().note;
  const theme = useTheme();
  const styles = stylesFn(theme);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(status === "granted");

      if (status === "granted") {
        fetchPhotos();
      }
    })();
  }, []);

  const fetchPhotos = async () => {
    const album = await MediaLibrary.getAssetsAsync({
      mediaType: ["photo", "video"],
    });
    setPhotos(album.assets);
  };

  const handleSelectItem = (id: string, mediaType: string) => {
    setSelectedItems((prev: any) => {
      // Check if the item with the specified id is already in selectedItems
      const exists = prev.some((item: any) => item.id === id);
      if (exists) {
        // If it exists, remove it
        return prev.filter((item: any) => item.id !== id);
      } else {
        // If it doesn't exist, add it
        return [
          ...prev,
          { id: id, type: mediaType === "video" ? "video" : "image" },
        ];
      }
    });
  };

  const handleSelectionComplete = () => {
    try {
      router.push({
        pathname: "/apply-now/[pageID]",
        params: {
          note: note,
          selectedFiles: JSON.stringify(selectedItems),
          //@ts-ignore
          pageID: pageID,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openCamera = async () => {
    if (cameraPermission?.granted) {
      setIsCameraVisible(true);
    } else {
      const status = await Camera.requestCameraPermissionsAsync();
      if (status.granted) {
        setIsCameraVisible(true);
      } else {
        alert("Camera permission is required to take photos");
      }
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        await MediaLibrary.createAssetAsync(photo.uri);
        fetchPhotos();
        setIsCameraVisible(false);
      } else {
        console.error("Failed to take photo");
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };
  //@ts-ignore
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectItem(item.uri, item.mediaType)}
      style={styles.itemWrapper}
    >
      <Surface style={styles.itemContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={
              selectedItems
                .map((selectedItem: any) => selectedItem.id)
                .includes(item.uri)
                ? "checked"
                : "unchecked"
            }
            onPress={() => handleSelectItem(item.uri, item.mediaType)}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  );

  if (!permissionGranted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Permission to access gallery is required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Barter Collab" />
      </Appbar.Header>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="camera"
          style={styles.button}
          onPress={openCamera}
        >
          Take a Photo
        </Button>
        <Button
          mode="contained"
          icon="video"
          style={styles.button}
          onPress={() => setIsCameraVisible(true)}
        >
          Take Video
        </Button>
      </View>

      {/* Camera Modal */}
      <Modal visible={isCameraVisible} animationType="slide">
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing="back"
          onCameraReady={() => {
            console.log("Camera ready");
          }}
        >
          <View style={styles.cameraButtons}>
            <Button
              mode="contained"
              icon="camera"
              onPress={async () => {
                await takePhoto();
              }}
              disabled={isRecording}
            >
              Capture Photo
            </Button>
            <Button
              mode="contained"
              icon="video"
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button mode="text" onPress={() => setIsCameraVisible(false)}>
              Close
            </Button>
          </View>
        </CameraView>
      </Modal>

      {/* Gallery */}
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.galleryContainer}
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Button mode="outlined" onPress={() => router.back()}>
          Go Back
        </Button>
        <Button mode="contained" onPress={handleSelectionComplete}>
          Done
        </Button>
      </View>
    </View>
  );
};
export default GalleryScreen;
