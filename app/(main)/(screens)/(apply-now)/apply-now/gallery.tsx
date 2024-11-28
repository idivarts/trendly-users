import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Modal,
  Pressable,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Button, Surface, Text, Checkbox } from "react-native-paper";
import {
  CameraView,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { stylesFn } from "@/styles/apply-now/gallery.styles";
import { useTheme } from "@react-navigation/native";
import ScreenHeader from "@/components/ui/screen-header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faVideo } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";

const GalleryScreen = () => {
  const { pageID } = useLocalSearchParams();
  const [assets, setAssets] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<MediaLibrary.AssetInfo[]>([]);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const {
    note,
    selectedFiles,
  } = useLocalSearchParams();
  const theme = useTheme();
  const styles = stylesFn(theme);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(status === "granted");

      if (status === "granted") {
        fetchAssets();
      }
    })();
  }, []);

  const fetchAssets = async () => {
    const album = await MediaLibrary.getAssetsAsync({
      mediaType: ["photo", "video"],
      sortBy: ["creationTime"],
      first: 250,
    });

    setAssets(album.assets);
  };

  const handleSelectItem = (item: MediaLibrary.AssetInfo) => {
    const itemExists = selectedItems.find((i) => i.id === item.id);

    if (itemExists) {
      setSelectedItems((prev: MediaLibrary.AssetInfo[]) => {
        return prev.filter((i) => i.id !== item.id);
      });
    } else {
      setSelectedItems((prev: MediaLibrary.AssetInfo[]) => {
        return [
          ...prev,
          item,
        ];
      });
    }
  };

  const handleSelectionComplete = () => {
    try {
      router.replace({
        pathname: '/apply-now/[pageID]',
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
        fetchAssets();
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

  useEffect(() => {
    if (selectedFiles) {
      //@ts-ignore
      const newFiles = JSON.parse(selectedFiles) as MediaLibrary.AssetInfo[];
      setSelectedItems(newFiles);
    }
  }, [selectedFiles]);

  const renderItem = ({
    item,
  }: {
    item: MediaLibrary.AssetInfo;
  }) => (
    <Pressable
      onPress={() => handleSelectItem(item)}
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
                .find((selectedItem: MediaLibrary.AssetInfo) => item.id === selectedItem.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => handleSelectItem(item)}
          />
        </View>
      </Surface>
    </Pressable>
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
      <ScreenHeader
        title="Select Photos and Videos"
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon={() => (
            <FontAwesomeIcon
              icon={faCamera}
              size={16}
              color={Colors(theme).white}
            />
          )}
          onPress={openCamera}
        >
          Take a Photo
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
            <Button
              mode="contained"
              onPress={() => setIsCameraVisible(false)}
            >
              Close
            </Button>
          </View>
        </CameraView>
      </Modal>

      {/* Gallery */}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id + item.filename}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.galleryContainer}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Button mode="contained" onPress={handleSelectionComplete}>
          Done
        </Button>
      </View>
    </View>
  );
};

export default GalleryScreen;
