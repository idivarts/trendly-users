import CarouselNative from "@/components/ui/carousel/carousel";
import ScreenHeader from "@/components/ui/screen-header";
import { FILE_SIZE } from "@/constants/FileSize";
import AppLayout from "@/layouts/app-layout";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AuthApp } from "@/utils/auth";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Paragraph,
  TextInput,
  HelperText,
  List,
} from "react-native-paper";

const ApplyScreenWeb = () => {
  const [note, setNote] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const styles = stylesFn(theme);
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const uploadFile = async (file: File): Promise<any> => {
    try {
      const date = new Date().getTime();
      const preSignedUrl = await axios.post(
        `https://be.trendly.pro/s3/v1/${file.type.includes("video") ? "videos" : "images"
        }?filename=${date}.${file.type.split("/")[1]}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthApp.currentUser?.uid}`,
          },
        }
      );

      const uploadURL = preSignedUrl.data.uploadUrl;

      // File size limit check (10 MB for example)
      if (file.size > FILE_SIZE) {
        Toaster.error("File size limit exceeded");
        return;
      }

      const response = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      if (file.type.includes("video")) {
        return {
          type: "video",
          appleUrl: preSignedUrl.data.appleUrl,
          playUrl: preSignedUrl.data.playUrl,
        };
      } else {
        return {
          type: "image",
          url: preSignedUrl.data.imageUrl,
        };
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file");
    }
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    const uploadedAttachments: any[] = [];

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadFile(file);
        uploadedAttachments.push(result);
      });

      await Promise.all(uploadPromises);

      setAttachments(uploadedAttachments);

      router.navigate({
        pathname: "/apply-now/preview",
        params: {
          pageID,
          note,
          attachments: JSON.stringify(uploadedAttachments),
        },
      });
    } catch (error) {
      setErrorMessage("Error uploading files");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>Upload files</Paragraph>
            <View style={styles.cardContent}>
              <input
                type="file"
                multiple
                onChange={handleFileSelection}
                accept="image/*, video/*"
              />
              <IconButton
                icon="upload"
                size={20}
                onPress={() => document.querySelector("input")?.click()}
              />
            </View>
          </Card.Content>
        </Card>

        {
          files.length > 0 && (
            <CarouselNative
              data={files.map((file: any) => {
                return {
                  type: file.type,
                  url: file.id,
                };
              })}
              onImagePress={(index) => {
                console.log("Image Pressed", index);
              }}
            />
          )
        }
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          <TextInput
            label="Add a short note"
            mode="outlined"
            multiline
            onChangeText={(text) => setNote(text)}
            style={styles.input}
            value={note}
          />
          <HelperText type="info" style={styles.helperText}>
            Write a short note to the brand about why you are interested in this
          </HelperText>

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

          {
            errorMessage ? (
              <HelperText type="error" style={styles.errorText}>
                {errorMessage}
              </HelperText>
            ) : null
          }

          <Button
            mode="contained"
            onPress={async () => {
              if (!note || note.length === 0) {
                Toaster.error("Please add a note");
                return;
              }

              if (files.length === 0) {
                Toaster.error("Please upload a asset");
                return;
              }

              await handleUploadFiles();
            }}
            loading={loading}
          >
            Preview Application
          </Button>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ApplyScreenWeb;
