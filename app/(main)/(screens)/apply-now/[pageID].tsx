import AssetsPreview from "@/components/ui/assets-preview";
import Button from "@/components/ui/button";
import ListItem from "@/components/ui/list-item/ListItem";
import ScreenHeader from "@/components/ui/screen-header";
import TextInput from "@/components/ui/text-input";
import Colors from "@/constants/Colors";
import { useAWSContext } from "@/contexts/aws-context.provider";
import AppLayout from "@/layouts/app-layout";
import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AssetItem } from "@/types/Asset";
import { FirestoreDB } from "@/utils/firestore";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faClapperboard,
  faClockRotateLeft,
  faDollarSign,
  faPaperclip
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Card,
  HelperText,
  IconButton,
  List,
  Paragraph,
  ProgressBar,
} from "react-native-paper";

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
  const [quotation, setQuotation] = useState("");
  const [files, setFiles] = useState<AssetItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [profileAttachments, setProfileAttachments] = useState<Attachment[]>(
    []
  );
  const [questions, setQuestions] = useState<string[]>([]);
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
  } = useAWSContext();

  const handleAssetUpload = async () => {
    try {
      router.push({
        pathname: "/apply-now/gallery",
        params: {
          ...params,
          pageID,
          note,
          quotation,
          path: `/apply-now/[pageID]`,
          //@ts-ignore
          timelineData,
          selectedFiles: params.selectedFiles,
          profileAttachmentsRoute: params.profileAttachments,
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
      const uploadedFiles = await uploadAttachments(fileAttachments);

      const filesWithoutProfileAttachments = // if file uri starts with https, it is a profile attachment and should be removed
        files.filter((file) => !file.uri.startsWith("https"));

      const uploadedFileUrisResponse = await uploadFileUris(
        filesWithoutProfileAttachments
      );

      const finalProfileAttachments = profileAttachments.map(
        //@ts-ignore
        ({ id, ...rest }) => rest // Exclude the `id` field
      );

      setUploadedFiles([
        ...uploadedFileUrisResponse,
        ...finalProfileAttachments,
      ]);

      const finalFiles = [
        ...uploadedFileUrisResponse,
        ...finalProfileAttachments,
      ];
      const timelineTimestamp = timelineData?.getTime();

      setLoading(false);
      setProcessMessage("");
      setProcessPercentage(0);
      router.push({
        pathname: "/apply-now/preview",
        params: {
          ...params,
          pageID,
          note,
          attachments: JSON.stringify(finalFiles),
          quotation: quotation,
          timeline: timelineTimestamp,
          fileAttachments: JSON.stringify(uploadedFiles),
          answers: JSON.stringify(answers),
        },
      });
      setLoading(false);
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

    if (params.note) {
      setNote(params.note as string);
    }
  }, [params.selectedFiles, params.pageID]);

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
    } else {
      if (!params.quotation) {
        setQuotation("");
      }
    }
  }, [params.value]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
        nestedScrollEnabled={true}
      >
        {files.length === 0 && (
          <Card style={styles.card} onPress={handleAssetUpload}>
            <Card.Content style={styles.cardContent}>
              <IconButton
                icon={() => (
                  <FontAwesomeIcon
                    color={
                      theme.dark ? Colors(theme).text : Colors(theme).primary
                    }
                    icon={faClapperboard}
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

        {files.length > 0 && (
          <>
            <AssetsPreview
              files={files.map((file) => ({
                id: file.id,
                type: file.type,
                url: file.type.includes("video")
                  ? file.localUri || file.uri
                  : file.uri,
              }))}
              handleAssetUpload={handleAssetUpload}
            />
          </>
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

          <List.Section
            style={{
              width: "100%",
            }}
          >
            <ListItem
              title="Your Quote"
              leftIcon={faDollarSign}
              content={quotation === "" ? "" : "Rs. " + quotation}
              rightContent={true}
              onAction={() => {
                router.push({
                  pathname: "/apply-now/quotation",
                  params: {
                    title: "Quotation",
                    value: quotation === "" ? "" : quotation,
                    path: `/apply-now/${pageID}`,
                    selectedFiles: params.selectedFiles,
                    profileAttachments: params.profileAttachments,
                    placeholder: "Add your quotation",
                    //@ts-ignore
                    timelineData: timelineData,
                    fileAttachments: JSON.stringify(fileAttachments),
                    answers: JSON.stringify(answers),
                    note: note,
                  },
                });
              }}
            />
            <ListItem
              title="Timeline"
              leftIcon={faClockRotateLeft}
              rightContent={true}
              content={timelineData ? timelineData.toLocaleDateString() : ""}
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
            <FlatList
              data={questions}
              nestedScrollEnabled
              renderItem={({ item: question, index }) => (
                <ListItem
                  key={index}
                  title={question}
                  leftIcon={faCircleQuestion}
                  content={answers[index]}
                  onAction={() => {
                    router.push({
                      pathname: "/apply-now/question",
                      params: {
                        title: "Question " + (index + 1),
                        value: answers[index] || "",
                        path: `/apply-now/${pageID}`,
                        selectedFiles: params.selectedFiles,
                        actualQuestion: question,
                        profileAttachments: params.profileAttachments,
                        placeholder: "",
                        //@ts-ignore
                        timelineData: timelineData,
                        fileAttachments: JSON.stringify(fileAttachments),
                        answers: JSON.stringify(answers),
                        quotation: quotation,
                        note: note,
                      },
                    });
                  }}
                />
              )}
            ></FlatList>
            {/* {questions.map((question, index) => (
              
            ))} */}
          </List.Section>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
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
      {showDatePicker && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: theme.colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Button onPress={() => setShowDatePicker(false)}>Cancel</Button>
            <Button
              onPress={() => {
                if (!timelineData) {
                  setTimelineData(new Date());
                }
                setShowDatePicker(false);
              }}
            >
              Done
            </Button>
          </View>
          <DateTimePicker
            value={timelineData || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setTimelineData(selectedDate);
              }
            }}
            themeVariant={theme.dark ? "dark" : "light"}
            minimumDate={new Date()}
          />
        </View>
      )}
    </AppLayout>
  );
};

export default ApplyScreen;
