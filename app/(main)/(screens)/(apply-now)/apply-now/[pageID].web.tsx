import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  TextInput,
  HelperText,
  List,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useAWSContext } from "@/contexts/aws-context.provider";
import AppLayout from "@/layouts/app-layout";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/ApplyNow.styles";
import {
  faLink,
  faLocationDot,
  faPaperclip,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "@/components/ui/list-item/ListItem";
import AssetsPreview from "@/components/ui/assets-preview";

const ApplyScreenWeb = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{
    id: string;
    type: string;
    url: string;
  }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    processMessage,
    processPercentage,
    setProcessMessage,
    setProcessPercentage,
    uploadFiles,
  } = useAWSContext();

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    const assetExists = files.find((file) => {
      return Array.from(selectedFiles as FileList).find((f) => f.name === file.name);
    });

    if (assetExists) {
      Toaster.error("File with name already exists");
      return;
    }

    if (selectedFiles) {
      setFiles([...files, ...Array.from(selectedFiles)]);
    }
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      const uploadedFilesResponse = await uploadFiles(files);

      setUploadedFiles(uploadedFilesResponse);

      setTimeout(() => {
        setLoading(false);
        setProcessMessage("");
        setProcessPercentage(0);
        router.navigate({
          pathname: "/apply-now/preview",
          params: {
            pageID,
            note,
            attachments: JSON.stringify(uploadedFilesResponse),
          },
        });
      }, 5000);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error uploading files");
      setLoading(false);
    }
  };

  useEffect(() => {
    const urls = files.map(file => ({
      id: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url.url);
      });
    };
  }, [files]);

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.name !== id));
  }

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Card
          style={styles.card}
          onPress={() => inputRef.current?.click()}
        >
          <Card.Content
            style={styles.cardContent}
          >
            <IconButton
              icon={
                () => (
                  <FontAwesomeIcon
                    icon={faUpload}
                    size={20}
                    color={Colors(theme).text}
                  />
                )
              }
              onPress={() => inputRef.current?.click()}
            />
          </Card.Content>
          <input
            ref={inputRef}
            type="file"
            style={{
              backgroundColor: 'transparent',
              visibility: 'hidden',
            }}
            multiple
            onChange={handleFileSelection}
            accept="image/*, video/*"
          />
        </Card>
        {
          files.length > 0 && (
            <AssetsPreview
              files={previewUrls.map((file) => ({
                id: file.id,
                type: file.type,
                url: file.url,
              }))}
              handleAssetUpload={() => inputRef.current?.click()}
              onRemove={removeFile}
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
            style={{
              backgroundColor: Colors(theme).background,
            }}
            activeOutlineColor={Colors(theme).primary}
            label="Add a short note"
            mode="outlined"
            multiline
            onChangeText={(text) => setNote(text)}
            placeholderTextColor={Colors(theme).text}
            textColor={Colors(theme).text}
            value={note}
          />
          <HelperText type="info" style={styles.helperText}>
            Write a short note to the brand about why you are interested in this
          </HelperText>

          <List.Section>
            <ListItem
              title="Your Quote"
              leftIcon={faQuoteLeft}
              onPress={() => console.log("Quote")}
            />
            <ListItem
              title="Attachments"
              leftIcon={faPaperclip}
              onPress={() => console.log("Attachments")}
            />
            <ListItem
              title="Add relevant Links"
              leftIcon={faLink}
              onPress={() => console.log("Links")}
            />
            <ListItem
              title="Add location"
              leftIcon={faLocationDot}
              onPress={() => console.log("Location")}
            />
          </List.Section>

          {
            errorMessage && (
              <HelperText type="error" style={styles.errorText}>
                {errorMessage}
              </HelperText>
            )
          }

          {
            processMessage && (
              <HelperText type="info" style={styles.processText}>
                {processMessage} - {processPercentage}% done
              </HelperText>
            )
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
            {
              processMessage ? "Uploading Assets" : "Preview Application"
            }
          </Button>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ApplyScreenWeb;
