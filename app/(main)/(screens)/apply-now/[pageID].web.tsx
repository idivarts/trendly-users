import React, { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  TextInput,
  HelperText,
  List,
  ProgressBar,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as DocumentPicker from "expo-document-picker";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useAWSContext } from "@/contexts/aws-context.provider";
import AppLayout from "@/layouts/app-layout";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { doc, getDoc } from "firebase/firestore";
import { stylesFn } from "@/styles/ApplyNow.styles";
import {
  faLink,
  faLocationDot,
  faPaperclip,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import ListItem from "@/components/ui/list-item/ListItem";
import AssetsPreview from "@/components/ui/assets-preview";
import { useBreakpoints } from "@/hooks";
import { TextModal } from "@/components/TextInputModal/TextModal.web";
import { handleModalOrInputPage } from "@/utils/TextInput";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { FirestoreDB } from "@/utils/firestore";

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
  const [answers, setAnswers] = useState<{ [key: string]: string }>(
    params.answers ? JSON.parse(params.answers as string) : {}
  );

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    placeholder: "",
    value: "",
    onSubmit: (value: string) => {},
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
  const [previewUrls, setPreviewUrls] = useState<
    {
      id: string;
      type: string;
      url: string;
    }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [fileAttachments, setFileAttachments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const { xl } = useBreakpoints();

  const {
    processMessage,
    processPercentage,
    setProcessMessage,
    setProcessPercentage,
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
      const collabRef = doc(FirestoreDB, "collaborations", pageID);
      const collabDoc = await getDoc(collabRef);
      const collabData = collabDoc.data() as ICollaboration;
      if (collabData.questionsToInfluencers) {
        setQuestions(collabData.questionsToInfluencers);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      const uploadedFiles = await uploadAttachments(fileAttachments);
      const uploadedFilesResponse = await uploadFiles(files);

      setUploadedFiles(uploadedFilesResponse);

      const timelineTimestamp = timelineData?.getTime() || 0;

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
            quotation: quotation,
            timeline: timelineTimestamp,
            fileAttachments: JSON.stringify(uploadedFiles),
            answers: JSON.stringify(answers),
          },
        });
      }, 5000);
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
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url.url);
      });
    };
  }, [files]);

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.name !== id));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTimelineData(selectedDate);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Card style={styles.card} onPress={() => inputRef.current?.click()}>
          <Card.Content style={styles.cardContent}>
            <IconButton
              icon={() => (
                <FontAwesomeIcon
                  icon={faUpload}
                  size={20}
                  color={Colors(theme).text}
                />
              )}
              onPress={() => inputRef.current?.click()}
            />
          </Card.Content>
          <input
            ref={inputRef}
            type="file"
            style={{
              backgroundColor: "transparent",
              visibility: "hidden",
            }}
            multiple
            onChange={handleFileSelection}
            accept="image/*, video/*"
          />
        </Card>
        {files.length > 0 && (
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
              leftIcon={faQuoteLeft}
              content={quotation === "" ? "" : "Rs. " + quotation}
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
              leftIcon={faPaperclip}
              content=""
              rightContent={true}
              onAction={() => setShowDatePicker(true)}
            />
            <TextInput
              mode="outlined"
              onFocus={() => {}}
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
                    borderWidth: 0,
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
                setFileAttachments((prevAttachments: any) =>
                  prevAttachments.filter((f: any) => f.id !== id)
                );
              }}
            />
            {questions.map((question, index) => (
              <ListItem
                key={index}
                title={question}
                leftIcon={faLink}
                content={answers[index] || ""}
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

          {processMessage && (
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
          )}

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
            {processMessage ? "Uploading Assets" : "Preview Application"}
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