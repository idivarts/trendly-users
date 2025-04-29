import { TextModal } from "@/components/TextInputModal/TextModal.web";
import AssetsPreview from "@/components/ui/assets-preview";
import Button from "@/components/ui/button";
import ListItem from "@/components/ui/list-item/ListItem";
import ScreenHeader from "@/components/ui/screen-header";
import TextInput from "@/components/ui/text-input";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { AWSProgressUpdateSubject, useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import ProgressLoader from "@/shared-uis/components/ProgressLoader";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { handleModalOrInputPage } from "@/utils/TextInput";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faClapperboard,
  faClockRotateLeft,
  faDollarSign,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import {
  Card,
  HelperText,
  IconButton,
  List
} from "react-native-paper";
;

const ApplyScreenWeb = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timelineData, setTimelineData] = useState<Date | null>(null);
  const [quotation, setQuotation] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>(
    params.answers ? JSON.parse(params.answers as string) : {}
  );

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    placeholder: "",
    value: "",
    onSubmit: (value: string) => { },
  });

  const openModal = (
    title: string,
    placeholder: string,
    value: string,
    onSubmit: (value: string) => void
  ) => {
    setModalData({ isOpen: true, title, placeholder, value, onSubmit });
  };

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{
    id: string;
    type: string;
    url: string;
  }[]>([]);
  const [fileAttachments, setFileAttachments] = useState<any[]>([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const { xl } = useBreakpoints();

  const {
    processMessage,
    processPercentage,
    setProcessMessage,
    uploadFiles,
    uploadAttachments,
  } = useAWSContext();

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    const assetExists = files.find((file) => {
      return Array.from(selectedFiles as FileList).find(
        (f) => f.name === file.name
      );
    });

    if (assetExists) {
      Toaster.error("File with name already exists");
      return;
    }

    if (selectedFiles) {
      setFiles([...files, ...Array.from(selectedFiles)]);
    }
  };

  const fetchQuestions = async () => {
    try {
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
    if (hasFetchedData) return;
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
      setAnswers(
        applicationData.answersFromInfluencer.reduce(
          (acc, curr) => ({ ...acc, [curr.question]: curr.answer }),
          {}
        )
      );
      if (applicationData.attachments) {
        const attachments = applicationData.attachments.map((attachment) => {
          if (attachment.type === "video") {
            return {
              id: attachment.playUrl,
              type: attachment.type,
              url: attachment.playUrl,
            };
          } else {
            return {
              id: attachment.imageUrl,
              type: attachment.type,
              url: attachment.imageUrl,
            };
          }
        });

        const filesToSet = applicationData.attachments.map((attachment) => {
          if (attachment.type === "video") {
            return {
              id: attachment.playUrl,
              type: attachment.type,
              playUrl: attachment.playUrl,
              appleUrl: attachment.appleUrl,
            };
          } else {
            return {
              id: attachment.imageUrl,
              type: attachment.type,
              imageUrl: attachment.imageUrl,
            };
          }
        });
        setOriginalAttachments(filesToSet);

        setPreviewUrls(
          attachments as {
            id: string;
            type: string;
            url: string;
          }[]
        );
      }
    }
    setHasFetchedData(true);
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      var attachmentsToUploadWithoutParsing = [];
      var attachmentsToUploadWithParsing = [];

      for (var i = 0; i < fileAttachments.length; i++) {
        if (fileAttachments[i].uri) {
          attachmentsToUploadWithParsing.push(fileAttachments[i]);
        } else {
          attachmentsToUploadWithoutParsing.push(fileAttachments[i]);
        }
      }

      const uploadedFiles = await uploadAttachments(
        attachmentsToUploadWithParsing
      );

      const uploadedFilesResponse = await uploadFiles(files);

      const originalAttachmentsWithoutID = originalAttachments.map(
        //@ts-ignore
        ({ id, ...rest }) => rest // Exclude the `id` field
      );

      const filesWithoutID = attachmentsToUploadWithoutParsing.map(
        //@ts-ignore
        ({ id, ...rest }) => rest // Exclude the `id` field
      );

      var finalMedia = [
        ...originalAttachmentsWithoutID,
        ...uploadedFilesResponse,
      ];
      var finalFileAttachments = [...filesWithoutID, ...uploadedFiles];

      const timelineTimestamp = timelineData?.getTime() || 0;

      const applicationRef = doc(
        FirestoreDB,
        "collaborations",
        params.collaborationId as string,
        "applications",
        pageID
      );

      await updateDoc(applicationRef, {
        message: note,
        attachments: finalMedia,
        quotation: quotation,
        timeline: timelineTimestamp,
        fileAttachments: finalFileAttachments,
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
      setErrorMessage("Error uploading files");
      setLoading(false);
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

  useEffect(() => {
    const urls = files.map((file) => ({
      id: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setPreviewUrls([...urls, ...originalAttachments.map(o => ({
      ...processRawAttachment(o),
      id: processRawAttachment(o).url
    }))]);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url.url);
      });
    };
  }, [files]);

  const removeFile = (id: string) => {
    // setFiles(files.filter((f) => f.name !== id));
    setPreviewUrls(previewUrls.filter((f) => f.id !== id));
    if (originalAttachments.some((f) => f.id === id)) {
      setOriginalAttachments(originalAttachments.filter((f) => f.id !== id));
    }
    if (fileAttachments.some((f) => f.id === id)) {
      setFileAttachments(fileAttachments.filter((f) => f.id !== id));
    }
    if (files.some((f) => f.name === id)) {
      setFiles(files.filter((f) => f.name !== id));
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTimelineData(selectedDate);
    }
  };

  useEffect(() => {
    fetchApplicationData();
    fetchQuestions();
  }, []);

  return (
    <AppLayout withWebPadding>
      <ScreenHeader title="Edit Application" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {previewUrls.length == 0 &&
          <Card style={styles.card} onPress={() => inputRef.current?.click()}>
            <Card.Content style={styles.cardContent}>
              <IconButton
                icon={() => (
                  <FontAwesomeIcon
                    icon={faClapperboard}
                    size={20}
                    color={Colors(theme).text}
                  />
                )}
                onPress={() => inputRef.current?.click()}
              />
            </Card.Content>
          </Card>}
        <input
          ref={inputRef}
          type="file"
          style={{
            backgroundColor: "transparent",
            visibility: "hidden",
            border: "none",
          }}
          multiple
          onChange={handleFileSelection}
          accept="image/*, video/*"
        />
        {previewUrls.length > 0 && (
          <AssetsPreview
            files={previewUrls.map((file) => ({
              id: file.id,
              type: file.type,
              url: file.url,
            }))}
            handleAssetUpload={() => inputRef.current?.click()}
            onRemove={removeFile}
          />
        )}
        <View>
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
              leftIcon={faDollarSign}
              content={quotation === "" ? "Add now" : "Rs. " + quotation}
              rightContent={true}
              onAction={() => {
                handleModalOrInputPage({
                  isWeb: Platform.OS === "web",
                  openModal,
                  router,
                  fieldTitle: "Enter Quotation",
                  fieldValue: quotation,
                  setFieldValue: (value) =>
                    setQuotation(value.replace(/[^0-9]/g, "")),
                  pathBack: `/apply-now/${pageID}`,
                });
              }}
            />
            <ListItem
              title="Timeline"
              leftIcon={faClockRotateLeft}
              rightContent={true}
              content=""
              onAction={() => setShowDatePicker(true)}
            />
            <TextInput
              mode="outlined"
              onFocus={() => { }}
              render={(props) => (
                //@ts-ignore
                <input
                  {...props}
                  type="date"
                  onChange={(e) => setTimelineData(new Date(e.target.value))}
                  value={
                    timelineData ? timelineData.toISOString().split("T")[0] : ""
                  }
                  placeholder="Select a date"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: 16,
                    color: "inherit",
                    outline: "none",
                  }}
                />
              )}
            />
            <ListItem
              title="Attachments"
              leftIcon={faPaperclip}
              content=""
              attachments={fileAttachments}
              onAction={handlePickAttachment}
              onRemove={(id) => {
                setFileAttachments(fileAttachments.filter((f) => f.id !== id));
              }}
            />
            {questions.map((question, index) => (
              <ListItem
                key={index}
                title={question}
                leftIcon={faCircleQuestion}
                content={answers[index] || "Add now"}
                onAction={() => {
                  handleModalOrInputPage({
                    isWeb: Platform.OS === "web",
                    openModal,
                    router,
                    fieldTitle: question,
                    fieldValue: answers[index],
                    setFieldValue: (value) =>
                      setAnswers({ ...answers, [index]: value }),
                    pathBack: `/apply-now/${pageID}`,
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

          {/* {processMessage && (
            <HelperText type="info" style={styles.processText}>
              {processMessage} - {processPercentage}% done
            </HelperText>
          )}

          {processMessage && (
            <ProgressBar
              progress={processPercentage / 100}
              color={Colors(theme).primary}
              style={styles.progressBar}
            />
          )} */}
          {loading && <ProgressLoader isProcessing={loading} progress={0} subject={AWSProgressUpdateSubject} />}

          <Button
            mode="contained"
            onPress={async () => {
              if (!note || note.length === 0) {
                Toaster.error("Please add a note");
                return;
              }

              if (files.length === 0 && originalAttachments.length === 0) {
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
      <TextModal
        isOpen={modalData.isOpen}
        type="text"
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        placeholder={modalData.placeholder}
        value={modalData.value}
        onSubmit={modalData.onSubmit}
      />
    </AppLayout>
  );
};

export default ApplyScreenWeb;
