import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AuthApp } from "@/utils/auth";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Image,
  Text,
  Platform,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  HelperText,
  IconButton,
  List,
  Paragraph,
  TextInput,
} from "react-native-paper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Toast from "react-native-toast-message";
import { FILE_SIZE } from "@/constants/FileSize";

const ApplyScreen = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>(
    Array.isArray(params.note) ? params.note[0] : params.note
  );
  const [files, setFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [attachments, setAttachments] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleCvUpload = async () => {
    try {
      router.navigate({
        pathname: "/apply-now/gallery",
        params: { pageID, note },
      });
    } catch (e) {
      console.error(e);
      setErrorMessage("Error uploading file");
    }
  };

  const getFileUrlFromPhotoUri = async (uri: string): Promise<string> => {
    if (Platform.OS !== "ios") return uri;

    if (uri.startsWith("ph://")) {
      try {
        // Extract asset ID from ph:// URI
        const assetId = uri.replace("ph://", "");
        const asset = await MediaLibrary.getAssetInfoAsync(assetId);

        if (!asset?.localUri) {
          throw new Error("Could not get local URI for video");
        }

        return asset.localUri;
      } catch (error) {
        console.error("Error converting ph:// URI:", error);
        throw new Error("Failed to access video file");
      }
    }

    return uri;
  };

  const uploadVideo = async (fileUri: string): Promise<any> => {
    try {
      const date = new Date().getTime();
      const preSignedUrl = await axios.post(
        `https://be.trendly.pro/s3/v1/videos?filename=${date}.mp4`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthApp.currentUser?.uid}`,
          },
        }
      );

      const uploadURL = preSignedUrl.data.uploadUrl;

      // Convert ph:// URI to file:// URI if needed
      const actualFileUri = await getFileUrlFromPhotoUri(fileUri);

      // Get file info using the converted URI
      const videoInfo = await FileSystem.getInfoAsync(actualFileUri);
      if (!videoInfo.exists) {
        throw new Error("Video file does not exist");
      }

      // Upload file using the converted URI
      const response = await fetch(actualFileUri);
      const blob = await response.blob();

      if (blob.size > FILE_SIZE) {
        Toaster.error("File size exceeds 10MB limit");
        return;
      }

      const result = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: blob,
      });

      if (!result.ok) {
        throw new Error("Failed to upload video");
      }

      return {
        appleUrl: preSignedUrl.data.appleUrl,
        type: "video",
        playUrl: preSignedUrl.data.playUrl,
      };
    } catch (error) {
      console.error("Video upload error:", error);
      throw new Error("Failed to upload video");
    }
  };

  const handleUploadImage = async () => {
    setLoading(true); // Show loading indicator
    const uploadedAttachments: any = []; // Local array to hold attachments during upload

    try {
      // Map over files and upload each one
      const uploadPromises = files.map(async (fileUri: any) => {
        if (fileUri.type === "image") {
          const date = new Date().getTime();
          const preSignedUrl = await axios.post(
            `https://be.trendly.pro/s3/v1/images?filename=${date}.jpg`,
            {},
            {
              headers: {
                Authorization: `Bearer ${AuthApp.currentUser?.uid}`,
              },
            }
          );
          const uploadURL = preSignedUrl.data.uploadUrl;

          const response = await fetch(fileUri.id);
          const blob = await response.blob();

          const result = await fetch(uploadURL, {
            method: "PUT",
            headers: {
              "Content-Type": "image/jpeg",
            },
            body: blob,
          });

          if (result.ok) {
            uploadedAttachments.push({
              url: preSignedUrl.data.imageUrl,
              type: "image",
            });
          } else {
            console.error("Failed to upload file");
          }
        } else {
          const videoResult = await uploadVideo(fileUri.id);
          uploadedAttachments.push(videoResult);
        }
      });

      // Wait until all uploads finish
      await Promise.all(uploadPromises);

      setAttachments(uploadedAttachments);

      // Navigate after attachments state is updated
      router.push({
        pathname: "/apply-now/preview",
        params: {
          pageID,
          note,
          attachments: JSON.stringify(uploadedAttachments),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    if (params.selectedFiles) {
      //@ts-ignore
      const newFiles = JSON.parse(params.selectedFiles) as string[];
      setFiles(newFiles);
    }
  }, [params.selectedFiles]);

  return (
    <AppLayout>
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: Colors(theme).background,
        }}
      >
        <BackButton />
        <Appbar.Content title="Apply Now" color={Colors(theme).text} />
      </Appbar.Header>
      <Toast />
      <ScrollView style={styles.container}>
        <Card style={styles.card} onPress={handleCvUpload}>
          <Card.Content style={styles.cardContent}>
            <IconButton icon="camera" size={40} style={styles.uploadIcon} />
            <Paragraph>
              Record a video or add a photo carousel that best describes you
            </Paragraph>
          </Card.Content>
        </Card>
        {/* Note Input */}
        <TextInput
          label="Add a short note"
          value={note}
          onChangeText={(text) => setNote(text)}
          mode="outlined"
          style={styles.input}
          outlineStyle={{
            borderRadius: 8,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderColor: Colors(theme).gray100,
            backgroundColor: Colors(theme).background,
          }}
          multiline
          theme={{ colors: { primary: Colors(theme).primary } }}
        />
        <HelperText type="info" style={styles.helperText}>
          Write a short note to the brand about why you are interested in this
        </HelperText>
        {/* CV Upload */}
        {/* Uploaded Files */}
        {files.length > 0 && (
          <>
            <Text>Attachments</Text>
            <ScrollView horizontal style={styles.previewContainer}>
              {files.map((fileUri: any, index) => {
                return (
                  <View key={index} style={styles.previewItem}>
                    <Image
                      source={{ uri: fileUri.id }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
        {/* Error Message */}
        <List.Section>
          <List.Item
            title="Your Quote"
            left={() => <List.Icon icon="format-quote-close" />}
            onPress={() => console.log("Quote")}
          />
          <List.Item
            title="Attachments"
            left={() => <List.Icon icon="attachment" />}
            onPress={() => console.log("Attachments")}
          />
          <List.Item
            title="Add relevant Links"
            left={() => <List.Icon icon="link" />}
            onPress={() => console.log("Links")}
          />
          <List.Item
            title="Add location"
            left={() => <List.Icon icon="map-marker" />}
            onPress={() => console.log("Location")}
          />
        </List.Section>
        {errorMessage ? (
          <HelperText type="error" style={styles.errorText}>
            {errorMessage}
          </HelperText>
        ) : null}
        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={async () => {
            await handleUploadImage();
          }}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors(theme).background} />
          ) : (
            "Preview Application"
          )}
        </Button>
      </ScrollView>
    </AppLayout>
  );
};

export default ApplyScreen;
