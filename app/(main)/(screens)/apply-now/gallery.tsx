import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Modal,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Surface, Text, Checkbox } from "react-native-paper";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { stylesFn } from "@/styles/apply-now/gallery.styles";
import { useTheme } from "@react-navigation/native";
import ScreenHeader from "@/components/ui/screen-header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";
import { AssetItem } from "@/types/Asset";
import { useAuthContext } from "@/contexts";
import { processRawAttachment } from "@/utils/attachments";
import RenderMediaItem from "@/components/ui/carousel/render-media-item";
import Button from "@/components/ui/button";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Toast from "react-native-toast-message";

const GalleryScreen = () => {
  const { pageID } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const [assets, setAssets] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<AssetItem[]>([]);
  const [profileAttachments, setProfileAttachments] = useState<any[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuthContext();

  const attachmentFiltered = user?.profile?.attachments?.map(
    (attachment, index) => {
      const processRawAttachmentToSubmit = processRawAttachment(attachment);
      return {
        id: index,
        attachment: processRawAttachmentToSubmit,
      };
    }
  );

  const cameraRef = useRef<CameraView>(null);
  const {
    note,
    selectedFiles,
    profileAttachmentsRoute,
    quotation,
    timelineData,
    collaborationId,
    fileAttachments,
    path,
    answers,
    originalAttachments,
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
      setSelectedItems((prev: AssetItem[]) => {
        return prev.filter((i) => i.id !== item.id);
      });
    } else {
      setSelectedItems((prev: AssetItem[]) => {
        return [
          ...prev,
          {
            id: item.id.toString(),
            localUri: item.localUri || "",
            type: item.mediaType === "video" ? "video" : "image",
            uri: item.uri,
          },
        ];
      });
    }
  };

  const handleSelectProfileItem = (ProfileMedia: any) => {
    const itemExists = profileAttachments.find((i) => i.id === ProfileMedia.id);

    if (itemExists) {
      setProfileAttachments((prev: any[]) =>
        prev.filter((i) => i.id !== ProfileMedia.id)
      );
    } else {
      const findOriginalAsset = user?.profile?.attachments?.find(
        (attachment) => {
          if (ProfileMedia.attachment.type === "image") {
            return attachment.imageUrl == ProfileMedia.attachment.url;
          } else {
            if (Platform.OS === "ios") {
              return attachment.appleUrl == ProfileMedia.attachment.url;
            } else {
              return attachment.playUrl == ProfileMedia.attachment.url;
            }
          }
        }
      );

      if (findOriginalAsset) {
        setProfileAttachments((prev: any[]) => [
          ...prev,
          {
            id: ProfileMedia.id,
            ...findOriginalAsset,
          },
        ]);
      } else {
        console.warn("No matching original asset found!");
      }
    }
  };

  const handleSelectionComplete = () => {
    try {
      if (selectedItems.length + profileAttachments.length > 6) {
        Toaster.error("You can only select up to 6 files");
        return;
      }
      router.back();
      router.replace({
        //@ts-ignore
        pathname: path,
        params: {
          note: note,
          selectedFiles: JSON.stringify(selectedItems),
          profileAttachments: JSON.stringify(profileAttachments),
          quotation: quotation,
          collaborationId,
          timelineData: timelineData,
          //@ts-ignore
          pageID: pageID,
          fileAttachments: fileAttachments,
          originalAttachments: originalAttachments,
          answers: answers,
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
        try {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);

          const newItem: AssetItem = {
            id: asset.id.toString(),
            localUri: asset.uri,
            type: "image",
            uri: asset.uri,
          };
          setSelectedItems((prev: AssetItem[]) => [...prev, newItem]);

          // Fetch the updated assets from the library
          fetchAssets();
          setIsCameraVisible(false);
        } catch (error) {
          console.error("Failed to save photo:", error);
        }
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      try {
        const video = await cameraRef.current.recordAsync();
        if (video && video.uri) {
          const asset = await MediaLibrary.createAssetAsync(video.uri);
          const newItem: AssetItem = {
            id: asset.id.toString(),
            localUri: asset.uri,
            type: "video",
            uri: asset.uri,
          };
          setSelectedItems((prev: AssetItem[]) => [...prev, newItem]);

          fetchAssets();
        }
      } catch (error) {
        console.error("Failed to record video:", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  useEffect(() => {
    if (selectedFiles) {
      //@ts-ignore
      const newFiles = JSON.parse(selectedFiles) as AssetItem[];
      setSelectedItems(newFiles);
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (profileAttachmentsRoute) {
      //@ts-ignore
      const newFiles = JSON.parse(profileAttachmentsRoute);
      setProfileAttachments(newFiles);
    }
  }, [profileAttachmentsRoute]);

  const renderItem = ({ item }: { item: MediaLibrary.AssetInfo }) => (
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
              selectedItems.find(
                (selectedItem: AssetItem) => item.id === selectedItem.id
              )
                ? "checked"
                : "unchecked"
            }
            onPress={() => handleSelectItem(item)}
          />
        </View>
        {item.mediaType === "video" ? (
          <View
            style={{
              position: "absolute",
              bottom: 2,
              left: 2,
              backgroundColor: Colors(theme).white,
              padding: 4,
              borderRadius: 4,
            }}
          >
            <Text>
              {new Date(item.duration * 1000).toISOString().substr(14, 5)}
            </Text>
          </View>
        ) : null}
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
      <ScreenHeader title="Select Photos and Videos" />
      <View
        style={{
          zIndex: 1000,
        }}
      >
        <Toast />
      </View>
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon={() => (
            <FontAwesomeIcon
              icon={faImage}
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
            <Button mode="contained" onPress={() => setIsCameraVisible(false)}>
              Close
            </Button>
          </View>
        </CameraView>
      </Modal>

      {/* Gallery */}

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {attachmentFiltered && attachmentFiltered.length > 0 && (
          <FlatList
            data={attachmentFiltered}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  const attachment = attachmentFiltered?.[index];
                  handleSelectProfileItem(item);
                }}
                style={{
                  margin: 4,
                }}
              >
                <Surface style={styles.itemContainer}>
                  <RenderMediaItem
                    handleImagePress={() => {}}
                    index={item.id}
                    item={item.attachment}
                    height={120}
                    width={120}
                    borderRadius={8}
                  />
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={
                        profileAttachments.find(
                          (selectedItem) => item.id === selectedItem.id
                        )
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => {
                        handleSelectProfileItem(item);
                      }}
                    />
                  </View>
                </Surface>
              </Pressable>
            )}
            numColumns={3}
            contentContainerStyle={styles.galleryContainer}
            ListHeaderComponent={
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginVertical: 16,
                  marginHorizontal: 16,
                }}
              >
                Media from your profile
              </Text>
            }
          />
        )}

        <FlatList
          data={assets}
          keyExtractor={(item) => item.id + item.filename}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.galleryContainer}
          ListHeaderComponent={
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 16,
                marginHorizontal: 16,
              }}
            >
              Media from your gallery
            </Text>
          }
        />
      </ScrollView>

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
