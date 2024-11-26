import AppLayout from "@/layouts/app-layout";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
} from "react-native";
import {
  Button,
  Card,
  HelperText,
  IconButton,
  List,
  Paragraph,
  TextInput,
} from "react-native-paper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import ScreenHeader from "@/components/ui/screen-header";
import CarouselNative from "@/components/ui/carousel/carousel";
import { useAWSContext } from "@/contexts/aws-context.provider";

const ApplyScreen = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>(
    Array.isArray(params.note) ? params.note[0] : params.note
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    uploadFileUris,
  } = useAWSContext();

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

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      const uploadedFileUrisResponse = await uploadFileUris(files);

      setUploadedFiles(uploadedFileUrisResponse);

      router.push({
        pathname: "/apply-now/preview",
        params: {
          pageID,
          note,
          attachments: JSON.stringify(uploadedFileUrisResponse),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Card style={styles.card} onPress={handleCvUpload}>
          <Card.Content style={styles.cardContent}>
            <IconButton icon="camera" size={40} style={styles.uploadIcon} />
            <Paragraph>
              Record a video or add a photo carousel that best describes you
            </Paragraph>
          </Card.Content>
        </Card>

        {
          files.length > 0 && (
            <CarouselNative
              data={files.map((file: any) => {
                return {
                  id: file.id,
                  type: file.type,
                  url: file.id,
                };
              })}
              onImagePress={(file) => {
                console.log("Image Pressed", file);
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

export default ApplyScreen;
