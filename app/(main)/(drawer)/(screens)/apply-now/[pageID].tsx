import ApplyNowContent from "@/components/collaboration/apply-now/ApplyNowContent";
import AssetsPreview from "@/components/ui/assets-preview";
import Button from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AssetItem } from "@/types/Asset";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
;

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
  const [quotation, setQuotation] = useState<number | undefined>(undefined);
  const [files, setFiles] = useState<AssetItem[]>([]);
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
  const router = useMyNavigation()

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    uploadFileUris,
    uploadAttachments,
  } = useAWSContext();

  const [totalFiles, setTotalFiles] = useState(0)

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
      Console.error(e);
      setErrorMessage("Error uploading file");
    }
  };

  // const onDateChange = (event: any, selectedDate?: Date) => {
  //   setShowDatePicker(false);
  //   if (selectedDate) {
  //     setTimelineData(selectedDate);
  //   }
  // };

  const handleUploadFiles = async () => {
    try {
      const filesWithoutProfileAttachments = // if file uri starts with https, it is a profile attachment and should be removed
        files.filter((file) => !file.uri.startsWith("https"));

      setTotalFiles(fileAttachments.length + filesWithoutProfileAttachments.length)
      setLoading(true);
      const [uploadedFiles, uploadedFileUrisResponse] = await Promise.all([
        uploadAttachments(fileAttachments),
        uploadFileUris(filesWithoutProfileAttachments)
      ]);

      const finalProfileAttachments = profileAttachments.map(
        //@ts-ignore
        ({ id, ...rest }) => rest // Exclude the `id` field
      );

      const finalFiles = [
        ...finalProfileAttachments,
        ...uploadedFileUrisResponse,
      ];

      const timelineTimestamp = timelineData?.getTime();

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
    } catch (error) {
      Console.error(error);
    } finally {
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
      Console.error(error);
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
      Console.error(error);
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
      setQuotation(params.quotation ? parseInt(params.quotation as string) : undefined);
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
        setQuotation(undefined);
      }
    }
  }, [params.value]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <AppLayout>
      <ScreenHeader title="Apply Now" />

      <ApplyNowContent
        note={note}
        quotation={quotation}
        questions={questions}
        answers={answers}
        attachmentLength={files.length}

        FileRenderComponent={<AssetsPreview
          files={files.map((file) => ({
            id: file.id,
            type: (file.type.includes("video") && file.localUri) ? "image" : file.type,
            url: file.uri,
          }))}
          handleAssetUpload={handleAssetUpload}
          onRemove={(id) => {
            setFiles((prevFiles) =>
              prevFiles.filter((file) => file.id !== id)
            );
          }}
        />}

        handleAssetUpload={handleAssetUpload}
        setNote={setNote}
        setQuotation={() => {
          router.push({
            pathname: "/apply-now/quotation",
            params: {
              title: "Quotation",
              value: quotation === undefined ? undefined : quotation,
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
        setAnswers={(question: string, index: number) => {
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
        handleSubmit={handleUploadFiles} />
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
