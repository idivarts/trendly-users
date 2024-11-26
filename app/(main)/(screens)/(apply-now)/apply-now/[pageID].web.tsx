import CarouselNative from "@/components/ui/carousel/carousel";
import ScreenHeader from "@/components/ui/screen-header";
import { useAWSContext } from "@/contexts/aws-context.provider";
import AppLayout from "@/layouts/app-layout";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { useTheme } from "@react-navigation/native";
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
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    uploadFiles,
  } = useAWSContext();

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      const uploadedFilesResponse = await uploadFiles(files);

      setUploadedFiles(uploadedFilesResponse);

      router.navigate({
        pathname: "/apply-now/preview",
        params: {
          pageID,
          note,
          attachments: JSON.stringify(uploadedFilesResponse),
        },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Error uploading files");
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
