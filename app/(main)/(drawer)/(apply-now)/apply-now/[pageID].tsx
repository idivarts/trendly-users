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
  ProgressBar,
  TextInput,
} from "react-native-paper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import ScreenHeader from "@/components/ui/screen-header";
import { useAWSContext } from "@/contexts/aws-context.provider";
import {
  faLink,
  faLocationDot,
  faPaperclip,
  faPhotoFilm,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "@/components/ui/list-item/ListItem";
import Colors from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as MediaLibrary from "expo-media-library";
import { AssetItem } from "@/types/Asset";
import AssetsPreview from "@/components/ui/assets-preview";

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

  const [files, setFiles] = useState<AssetItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    processMessage,
    processPercentage,
    setProcessMessage,
    setProcessPercentage,
    uploadFileUris,
  } = useAWSContext();

  const handleAssetUpload = async () => {
    try {
      router.push({
        pathname: "/apply-now/gallery",
        params: {
          pageID,
          note,
          selectedFiles: JSON.stringify(files),
        },
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

      setTimeout(() => {
        setLoading(false);
        setProcessMessage("");
        setProcessPercentage(0);
        router.push({
          pathname: "/apply-now/preview",
          params: {
            pageID,
            note,
            attachments: JSON.stringify(uploadedFileUrisResponse),
          },
        });
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getAssetData = async (id: string) => {
    const asset = await MediaLibrary.getAssetInfoAsync(id);

    return asset;
  }

  const getAssetsData = async (
    newFiles: AssetItem[]
  ) => {
    for (const file of newFiles) {
      const asset = await getAssetData(file.id);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: asset.id,
          localUri: asset.localUri || '',
          uri: asset.uri,
          type: asset.mediaType === 'video' ? 'video' : 'image',
        },
      ]);
    }
  }

  useEffect(() => {
    if (params.selectedFiles) {
      setFiles([]);
      //@ts-ignore
      const newFiles = JSON.parse(params.selectedFiles) as AssetItem[];

      getAssetsData(newFiles);
    }
  }, [params.selectedFiles]);

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {
          files.length === 0 && (
            <Card style={styles.card} onPress={handleAssetUpload}>
              <Card.Content style={styles.cardContent}>
                <IconButton
                  icon={() => (
                    <FontAwesomeIcon
                      color={theme.dark ? Colors(theme).text : Colors(theme).primary}
                      icon={faPhotoFilm}
                      size={36}
                    />
                  )}
                  size={40}
                  style={styles.uploadIcon}
                />
                <Paragraph style={styles.cardParagraph}>
                  Record a video or add a photo carousel that best describes you
                </Paragraph>
              </Card.Content>
            </Card>
          )
        }

        {
          files.length > 0 && (
            <AssetsPreview
              files={files.map((file) => ({
                id: file.id,
                type: file.type,
                url: file.type.includes('video') ? file.localUri || file.uri : file.uri,
              }))}
              handleAssetUpload={handleAssetUpload}
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
            errorMessage ? (
              <HelperText type="error" style={styles.errorText}>
                {errorMessage}
              </HelperText>
            ) : null
          }

          {
            processMessage && (
              <HelperText type="info" style={styles.processText}>
                {processMessage} - {processPercentage}% done
              </HelperText>
            )
          }

          <ProgressBar
            progress={processPercentage / 100}
            color={Colors(theme).primary}
            style={styles.progressBar}
          />

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

export default ApplyScreen;
