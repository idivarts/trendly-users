import AppLayout from "@/layouts/app-layout";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, ScrollView, View } from "react-native";
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
import * as DocumentPicker from "expo-document-picker";
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
import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { FirestoreDB } from "@/utils/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import ContentItem from "@/components/basic-profile/edit-profile/ContentItem";
import Toast from "react-native-toast-message";

const EditApplicationScreen = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>(
    Array.isArray(params.note) ? params.note[0] : params.note
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState("");
  const [files, setFiles] = useState<AssetItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [profileAttachments, setProfileAttachments] = useState<
    {
      id: string;
      imageUrl: string;
      playUrl: string;
      appleUrl: string;
      type: string;
    }[]
  >([]);
  const [originalAttachments, setOriginalAttachments] = useState<
    {
      id: string;
      imageUrl: string;
      playUrl: string;
      appleUrl: string;
      type: string;
    }[]
  >([]);
  const [finalFiles, setFinalFiles] = useState<
    {
      id: string;
      localUri: string;
      uri: string;
      type: string;
      imageUrl: string;
      playUrl: string;
      appleUrl: string;
    }[]
  >([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [fileAttachments, setFileAttachments] = useState<any[]>([]);

  const [timelineData, setTimelineData] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [answers, setAnswers] = useState<{ [key: string]: string }>(
    params.answers ? JSON.parse(params.answers as string) : {}
  );

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    processMessage,
    processPercentage,
    setProcessMessage,
    setProcessPercentage,
    uploadFileUris,
    uploadAttachments,
    uploadNewAssets,
  } = useAWSContext();

  const handleAssetUpload = async () => {
    try {
      router.push({
        pathname: "/apply-now/gallery",
        params: {
          ...params,
          pageID,
          note,
          path: "/edit-application/[pageID]",
          quotation,
          //@ts-ignore
          timelineData,
          selectedFiles: params.selectedFiles,
          collaborationId: params.collaborationId,
          profileAttachmentsRoute: params.profileAttachments,
          originalAttachments: JSON.stringify(originalAttachments),
          fileAttachments: JSON.stringify(fileAttachments),
          answers: JSON.stringify(answers),
        },
      });
    } catch (e) {
      console.error(e);
      setErrorMessage("Error uploading file");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTimelineData(selectedDate);
    }
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      var finalFilesToUploadWithoutParsing = [];
      var finalFilesToUploadWithParsing = [];
      for (const file of finalFiles) {
        if (!file.uri) {
          finalFilesToUploadWithoutParsing.push(file);
        } else {
          // finalFilesToUploadWithParsing.push(file);
          if (file.uri.startsWith("https")) {
            if (file.type === "image") {
              finalFilesToUploadWithoutParsing.push({
                imageUrl: file.uri,
                type: file.type,
              });
            } else {
              finalFilesToUploadWithoutParsing.push({
                playUrl: file.playUrl,
                type: file.type,
                appleUrl: file.appleUrl,
              });
            }
          } else {
            finalFilesToUploadWithParsing.push(file);
          }
        }
      }

      setLoading(false);

      var attachmentToUploadWithoutParsing = [];
      var attachmentToUploadWithParsing = [];

      if (fileAttachments.length > 0) {
        for (const file of fileAttachments) {
          if (!file.uri) {
            attachmentToUploadWithoutParsing.push(file);
          } else {
            attachmentToUploadWithParsing.push(file);
          }
        }
      }

      const uploadedFiles = await uploadAttachments(
        attachmentToUploadWithParsing
      );

      const uploadedFileUrisResponse = await uploadFileUris(
        finalFilesToUploadWithParsing
      );

      const finalProfileAttachments = finalFilesToUploadWithoutParsing.map(
        //@ts-ignore
        ({ id, ...rest }) => rest // Exclude the `id` field
      );

      const finalFileAttachment = [
        ...uploadedFiles,
        ...attachmentToUploadWithoutParsing,
      ];

      setUploadedFiles([
        ...uploadedFileUrisResponse,
        ...finalProfileAttachments,
      ]);

      const finalFilesSending = [
        ...uploadedFileUrisResponse,
        ...finalProfileAttachments,
      ];
      const timelineTimestamp = timelineData?.getTime();

      const applicationRef = doc(
        FirestoreDB,
        "collaborations",
        params.collaborationId as string,
        "applications",
        pageID
      );

      await updateDoc(applicationRef, {
        message: note,
        attachments: finalFilesSending,
        quotation: quotation,
        timeline: timelineTimestamp,
        fileAttachments: finalFileAttachment,
        answersFromInfluencer: Object.entries(answers).map(
          ([question, answer]) => ({
            question,
            answer,
          })
        ),
      });

      Toaster.success("Application updated successfully");
      setLoading(false);
      setProcessMessage("");
      setTimeout(() => {
        router.push("/collaborations");
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getAssetData = async (id: string) => {
    const asset = await MediaLibrary.getAssetInfoAsync(id);

    return asset;
  };

  const getAssetsData = async (newFiles: AssetItem[]) => {
    for (const file of newFiles) {
      const asset = await getAssetData(file.id);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: asset.id,
          localUri: asset.localUri || "",
          uri: asset.uri,
          type: asset.mediaType === "video" ? "video" : "image",
        },
      ]);
    }
  };

  const getProfileAssetsData = async (newFiles: any[]) => {
    for (const file of newFiles) {
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: file.id,
          localUri: "",
          uri:
            file.type === "image"
              ? file.imageUrl
              : Platform.OS === "ios"
              ? file.appleUrl
              : file.playUrl,
          type: file.type,
          imageUrl: file.imageUrl,
          playUrl: file.playUrl,
          appleUrl: file.appleUrl,
        },
      ]);
    }
  };

  const handlePickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newAttachment: any = {
          id: result.assets[0].name, // Use file name as ID
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
        };

        setFileAttachments((prevAttachments: any) => [
          ...prevAttachments,
          newAttachment,
        ]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      if (!params.collaborationId) {
        return;
      }

      const collabRef = doc(
        FirestoreDB,
        "collaborations",
        params.collaborationId as string
      );

      const collabDoc = await getDoc(collabRef);
      const collabData = collabDoc.data() as ICollaboration;

      if (collabData.questionsToInfluencers) {
        setQuestions(collabData.questionsToInfluencers);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchApplicationData = async () => {
    if (params.value || params.fileAttachments || params.quotation) {
      return;
    }
    const applicationRef = doc(
      FirestoreDB,
      "collaborations",
      params.collaborationId as string,
      "applications",
      pageID
    );
    const applicationDoc = await getDoc(applicationRef);
    const applicationData = applicationDoc.data() as IApplications;

    if (applicationData) {
      setNote(applicationData.message || "");
      setQuotation(applicationData.quotation || "");
      setTimelineData(
        applicationData.timeline ? new Date(applicationData.timeline) : null
      );
      setFileAttachments(applicationData.fileAttachments || []);
      setOriginalAttachments(
        applicationData.attachments as {
          id: string;
          imageUrl: string;
          playUrl: string;
          appleUrl: string;
          type: string;
        }[]
      );
      setAnswers(
        applicationData.answersFromInfluencer.reduce(
          (acc, curr) => ({ ...acc, [curr.question]: curr.answer }),
          {}
        )
      );
    }
  };

  useEffect(() => {
    fetchApplicationData();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (params.selectedFiles) {
      //@ts-ignore

      const newFiles = JSON.parse(
        params.selectedFiles as string
      ) as AssetItem[];
      getAssetsData(newFiles);
      if (params.profileAttachments) {
        const profileFiles = JSON.parse(params.profileAttachments as string);
        if (profileFiles.length > 0) {
          setProfileAttachments(profileFiles);
          getProfileAssetsData(profileFiles);
        } else {
          setProfileAttachments([]);
        }
      }
    }
    if (params.quotation) {
      setQuotation(params.quotation as string);
    }

    if (params.timelineData) {
      setTimelineData(new Date(params.timelineData as string));
    }

    if (params.fileAttachments) {
      setFileAttachments(JSON.parse(params.fileAttachments as string));
    }

    if (params.originalAttachments) {
      setOriginalAttachments(JSON.parse(params.originalAttachments as string));
    }

    if (params.note) {
      setNote(params.note as string);
    }

    if (params.originalAttachments) {
      setOriginalAttachments(JSON.parse(params.originalAttachments as string));
    }
  }, [params.selectedFiles]);

  useEffect(() => {
    if (params.value) {
      const { textbox } = JSON.parse(params.value as string);
      const { title: routeTitle, value: textBoxValue } = textbox;

      if (routeTitle === "Quotation") {
        setQuotation(textBoxValue);
      }
      if (routeTitle.includes("Question")) {
        const questionIndex = parseInt(routeTitle.split(" ")[1]) - 1;
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionIndex]: textBoxValue,
        }));
      }
    }
  }, [params.value]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const originalAttachmentWithID = originalAttachments.map(
      (attachment, index) => ({
        id:
          attachment.type === "image"
            ? attachment.imageUrl
            : attachment.playUrl,
        imageUrl: attachment.imageUrl,
        playUrl: attachment.playUrl,
        appleUrl: attachment.appleUrl,
        type: attachment.type,
      })
    );

    // check if the file is already uploaded

    const finalFiles = [...files, ...originalAttachmentWithID];

    // Remove duplicates
    const uniqueFiles = Array.from(
      new Set(finalFiles.map((file) => JSON.stringify(file)))
    ).map((file) => JSON.parse(file));

    setFinalFiles(uniqueFiles);
  }, [files, profileAttachments, originalAttachments]);

  return (
    <AppLayout>
      <ScreenHeader title="Edit Application" />
      <Toast />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {finalFiles.length === 0 && (
          <Card style={styles.card} onPress={handleAssetUpload}>
            <Card.Content style={styles.cardContent}>
              <IconButton
                icon={() => (
                  <FontAwesomeIcon
                    color={
                      theme.dark ? Colors(theme).text : Colors(theme).primary
                    }
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
        )}

        {finalFiles.length > 0 && (
          <AssetsPreview
            files={finalFiles.map((file) => ({
              id: file.id,
              type: file.type,
              url: file.type.includes("video")
                ? file.localUri || file.uri || Platform.OS === "ios"
                  ? file.appleUrl
                  : file.playUrl
                : file.uri || file.imageUrl,
            }))}
            onRemove={(id) => {
              setFinalFiles((prevFiles) =>
                prevFiles.filter((file) => file.id !== id)
              );
              if (files.some((file) => file.id === id)) {
                setFiles((prevFiles) =>
                  prevFiles.filter((file) => file.id !== id)
                );
              }
              if (profileAttachments.some((file) => file.id === id)) {
                setProfileAttachments((prevFiles) =>
                  prevFiles.filter((file) => file.id !== id)
                );
              }
              if (originalAttachments.some((file) => file.id === id)) {
                setOriginalAttachments((prevFiles) =>
                  prevFiles.filter((file) => file.id !== id)
                );
              }
            }}
            handleAssetUpload={handleAssetUpload}
          />
        )}

        <View>
          <TextInput
            style={{
              backgroundColor: Colors(theme).background,
              lineHeight: 22,
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

          <List.Section
            style={{
              width: "100%",
              gap: 16,
            }}
          >
            <ListItem
              title="Your Quote"
              leftIcon={faQuoteLeft}
              content={quotation === "" ? "Add now" : "Rs. " + quotation}
              onAction={() => {
                router.push({
                  pathname: "/apply-now/quotation",
                  params: {
                    title: "Quotation",
                    value: quotation === "" ? "" : quotation,
                    path: `/edit-application/${pageID}`,
                    selectedFiles:
                      params.selectedFiles || JSON.stringify(files),
                    profileAttachments:
                      params.profileAttachments ||
                      JSON.stringify(profileAttachments),
                    originalAttachments: JSON.stringify(originalAttachments),
                    placeholder: "Add your quotation",
                    //@ts-ignore
                    timelineData: timelineData,
                    fileAttachments: JSON.stringify(fileAttachments),
                    answers: JSON.stringify(answers),
                    note: note,
                    collaborationId: params.collaborationId,
                  },
                });
              }}
            />
            <ListItem
              title="Timeline"
              leftIcon={faPaperclip}
              content={
                timelineData
                  ? timelineData.toLocaleDateString()
                  : "Select a date"
              }
              onAction={() => setShowDatePicker(true)}
            />
            <ListItem
              title="Attachments"
              leftIcon={faPaperclip}
              content=""
              attachments={fileAttachments}
              onAction={handlePickAttachment}
              onRemove={(id) => {
                setFileAttachments((prevAttachments) =>
                  prevAttachments.filter((attachment) => attachment.id !== id)
                );
              }}
            />
            {questions.map((question, index) => (
              <ListItem
                key={index}
                title={question}
                leftIcon={faLink}
                content={answers[index] || "Add now"}
                onAction={() => {
                  router.push({
                    pathname: "/apply-now/question",
                    params: {
                      title: "Question " + (index + 1),
                      value: answers[index] || "",
                      path: `/edit-application/${pageID}`,
                      selectedFiles: params.selectedFiles,
                      profileAttachments: params.profileAttachments,
                      collaborationId: params.collaborationId,
                      placeholder: "",
                      //@ts-ignore
                      timelineData: timelineData,
                      fileAttachments: JSON.stringify(fileAttachments),
                      originalAttachments: JSON.stringify(originalAttachments),
                      answers: JSON.stringify(answers),
                      quotation: quotation,
                      note: note,
                    },
                  });
                }}
              />
            ))}
          </List.Section>

          {errorMessage ? (
            <HelperText type="error" style={styles.errorText}>
              {errorMessage}
            </HelperText>
          ) : null}

          {processMessage && (
            <HelperText type="info" style={styles.processText}>
              {processMessage} - {processPercentage}% done
            </HelperText>
          )}

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

              if (finalFiles.length === 0) {
                Toaster.error("Please upload a asset");
                return;
              }

              await handleUploadFiles();
            }}
            loading={loading}
          >
            {processMessage ? "Uploading Assets" : "Update Application"}
          </Button>
        </View>
      </ScrollView>
      {showDatePicker && (
        <DateTimePicker
          value={timelineData || new Date()} // Use the selected date or current date
          mode="date" // Show the date picker
          display="spinner" // Use spinner for iOS
          onChange={onDateChange} // Handle date changes
        />
      )}
    </AppLayout>
  );
};

export default EditApplicationScreen;