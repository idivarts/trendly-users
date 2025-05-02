import RenderMediaItem from "@/components/collaboration/render-media-item";
import Button from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/apply-now/gallery.styles";
import { AssetItem } from "@/types/Asset";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Camera, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  View
} from "react-native";
import { Checkbox, Surface, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

class Mutex {
  locked;
  currentAfter: any;
  constructor() {
    this.locked = false;
    this.currentAfter = undefined
  }

  useOnce(callback: any, after: any) {
    if (this.locked || after == this.currentAfter) {
      throw new Error("This variable can only be used once!");
    }
    this.locked = true;
    try {
      return callback();
    } finally {
      this.locked = false; // Releases the lock after execution
      this.currentAfter = after
    }
  }
}

const mutex = new Mutex();

const GalleryScreen = () => {
  const { pageID } = useLocalSearchParams();
  // const params = useLocalSearchParams();
  const [assets, setAssets] = useState<MediaLibrary.AssetInfo[]>([]);
  const [assetAfter, setAssetAfter] = useState<any>(undefined)
  const [reachedEnd, setReachedEnd] = useState<boolean>(false)
  // const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<AssetItem[]>([]);
  const [profileAttachments, setProfileAttachments] = useState<any[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraPermission] = useCameraPermissions();
  // const [isCameraVisible, setIsCameraVisible] = useState(false);
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

  const fetchAssets = async (after?: string): Promise<MediaLibrary.AssetInfo | undefined> => {
    if (reachedEnd)
      return undefined;
    console.log("---------------> Fetching New Assets", after);

    const album = await MediaLibrary.getAssetsAsync({
      mediaType: ["photo", "video"],
      sortBy: ["creationTime"],
      first: 20,
      after
    });

    if (after) {
      setAssets([...assets, ...album.assets])
    } else {
      setAssets(album.assets);
      mutex.currentAfter = undefined
    }

    if (album.assets.length > 0) {
      setAssetAfter(album.assets[album.assets.length - 1].id)
      return album.assets[0]
    } else {
      setReachedEnd(true)
    }
    return undefined
  };
  const handleScroll = ({ nativeEvent }: any) => {
    try {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20; // Threshold before reaching the end
      // console.log("Coming to Handle Scroll", layoutMeasurement.height + contentOffset.y,
      //   contentSize.height - paddingToBottom, assets.length);
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom && assets.length > 0) {
        mutex.useOnce(() => {
          fetchAssets(assetAfter);
        }, assetAfter); // Allowed
      }

      // mutex.useOnce(() => console.log("Trying again...")); // Error: Already used
    } catch (error) {
      console.log(error);
    }

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

  // const openCamera = async () => {
  //   if (cameraPermission?.granted) {
  //     setIsCameraVisible(true);
  //   } else {
  //     const status = await Camera.requestCameraPermissionsAsync();
  //     if (status.granted) {
  //       setIsCameraVisible(true);
  //     } else {
  //       alert("Camera permission is required to take photos");
  //     }
  //   }
  // };

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

  const openNativeCamera = async (mode: "photo" | "video") => {
    const mainStatus = await Camera.requestCameraPermissionsAsync();
    if (!mainStatus.granted) {
      alert("Camera permission is required to take photos");
    }
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to enable camera permissions.");
      return;
    }

    // Open the native camera app
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: mode === "photo" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true, // Allows cropping
      quality: 1, // High-quality image/video
    });

    // Handle the captured media
    if (!result.canceled && result.assets.length > 0) {
      console.log("Captured:", result.assets[0].uri);
      await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      let mAsset = await fetchAssets();
      if (mAsset) {
        const newItem: AssetItem = {
          id: mAsset.id,
          localUri: mAsset.uri,
          type:
            mAsset.mediaType === MediaLibrary.MediaType.video
              ? "video"
              : "image",
          uri: mAsset.uri,
        };
        setSelectedItems((prev: any) => [...prev, newItem]);
      }

    }
  };

  const renderProfileItem = ({ item, index }: { item: any, index: number }) => {
    const ind = profileAttachments.findIndex(
      (selectedItem) => item.id === selectedItem.id
    )
    return (
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
            handleImagePress={() => { }}
            index={item.id}
            item={item.attachment}
            height={120}
            width={120}
            borderRadius={8}
          />
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={
                ind >= 0
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => {
                handleSelectProfileItem(item);
              }}
            />
            {ind >= 0 && (
              <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: Colors(theme).primary,
                borderRadius: 3,
                width: "100%",
                height: "100%",
                alignItems: "center",
                padding: 7
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors(theme).white,
                }}>
                  {(ind + 1)}
                </Text>
              </View>)}
          </View>
        </Surface>
      </Pressable>
    )
  }
  const renderItem = ({ item }: { item: MediaLibrary.AssetInfo }) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem: AssetItem) => item.id === selectedItem.id
    );
    return (
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
                itemIndex >= 0
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => handleSelectItem(item)}
            />
            {itemIndex >= 0 && (
              <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: Colors(theme).primary,
                borderRadius: 3,
                width: "100%",
                height: "100%",
                alignItems: "center",
                padding: 7
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors(theme).white,
                }}>
                  {(profileAttachments.length + itemIndex + 1)}
                </Text>
              </View>)}
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
      </Pressable >
    )
  };

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
          onPress={() => openNativeCamera("photo")}
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
          onPress={() => openNativeCamera("video")}
        >
          Take Video
        </Button>
      </View>

      {/* Camera Modal */}
      {/* <CameraInputModal
        fetchAssets={fetchAssets}
        isCameraVisible={isCameraVisible}
        setIsCameraVisible={setIsCameraVisible}
        setSelectedItems={setSelectedItems}
      /> */}

      {/* Gallery */}

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onScroll={handleScroll}
        removeClippedSubviews={true}
      >
        {attachmentFiltered && attachmentFiltered.length > 0 && (
          <FlatList
            data={attachmentFiltered}
            renderItem={renderProfileItem}
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
          // initialNumToRender={9} // Only render first 5 images
          // maxToRenderPerBatch={12} // Render max 5 images per batch
          // windowSize={3} // Keep only 3 screen’s worth of content in memory
          removeClippedSubviews={true} // Unmount images not in view
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
