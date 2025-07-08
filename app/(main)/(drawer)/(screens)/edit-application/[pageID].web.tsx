import ApplyNowContent from "@/components/collaboration/apply-now/ApplyNowContent";
import { useApplication } from "@/components/proposals/useApplication";
import { TextModal } from "@/components/TextInputModal/TextModal.web";
import AssetsPreview from "@/components/ui/assets-preview";
import ScreenHeader from "@/components/ui/screen-header";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { handleModalOrInputPage } from "@/utils/TextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
;

const ApplyScreenWeb = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");
  const router = useMyNavigation()

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timelineData, setTimelineData] = useState<Date | null>(null);
  const [quotation, setQuotation] = useState<number | undefined>(undefined);
  const [questions, setQuestions] = useState<string[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>(
    params.answers ? JSON.parse(params.answers as string) : {}
  );

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    placeholder: "",
    value: "",
    type: "",
    onSubmit: (value: string) => { },
  });

  const openModal = (
    title: string,
    placeholder: string,
    value: string,
    onSubmit: (value: string) => void
  ) => {
    setModalData({ isOpen: true, title, placeholder, value, onSubmit, type: title == "Enter Quotation" ? "number" : "text" });
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
    setProcessMessage,
    uploadFiles,
    uploadAttachments,
  } = useAWSContext();

  const { updateApplication } = useApplication()

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
      Console.error(error);
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
      setQuotation(applicationData.quotation);
      // setTimelineData(
      //   applicationData.timeline ? new Date(applicationData.timeline) : null
      // );
      // setFileAttachments(applicationData.fileAttachments || []);
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
      // var finalFileAttachments = [...filesWithoutID, ...uploadedFiles];

      // const timelineTimestamp = timelineData?.getTime() || 0;

      await updateApplication(params.collaborationId as string, {
        message: note,
        attachments: finalMedia,
        quotation: quotation,
        // timeline: timelineTimestamp,
        // fileAttachments: finalFileAttachments,
        // @ts-ignore
        answersFromInfluencer: Object.entries(answers).map(
          ([question, answer]) => ({
            question,
            answer,
          })
        ),
      })

      Toaster.success("Application updated successfully");
      setLoading(false);
      setProcessMessage("");
      setTimeout(() => {
        router.push("/collaborations");
      }, 1000);
    } catch (error) {
      Console.error(error);
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
      Console.error(error);
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
      <ApplyNowContent note={note} quotation={quotation}
        questions={questions}
        answers={answers} attachmentLength={previewUrls.length}
        setNote={setNote}
        setQuotation={() => {
          handleModalOrInputPage({
            isWeb: Platform.OS === "web",
            openModal,
            router,
            fieldTitle: "Enter Quotation",
            fieldValue: quotation == undefined ? "" : "" + quotation,
            setFieldValue: (value) => {
              const d = value.replace(/[^0-9]/g, "")
              setQuotation(d ? parseInt(d) : 0)
            },
            pathBack: `/apply-now/${pageID}`,
          });
        }}
        setAnswers={(question: string, index: number) => {
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
        submitText="Update Application"
        handleSubmit={handleUploadFiles}
        handleAssetUpload={() => inputRef.current?.click()}
        FileRenderComponent={<AssetsPreview
          files={previewUrls.map((file) => ({
            id: file.id,
            type: file.type,
            url: file.url,
          }))}
          handleAssetUpload={() => inputRef.current?.click()}
          onRemove={removeFile}
        />}
        loading={loading}
        errorMessage={errorMessage} />

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
        type={modalData.type}
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
