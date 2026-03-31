import ApplyNowContent from "@/components/collaboration/apply-now/ApplyNowContent";
import { TextModal } from "@/components/TextInputModal/TextModal.web";
import AssetsPreview from "@/components/ui/assets-preview";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { handleModalOrInputPage } from "@/utils/TextInput";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
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
    // const dateRef = useRef<HTMLInputElement>()
    // const [showDatePicker, setShowDatePicker] = useState(false);
    const [timelineData, setTimelineData] = useState<Date | null>(null);
    const [quotation, setQuotation] = useState<number | undefined>(undefined);
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>(
        params.answers ? JSON.parse(params.answers as string) : {}
    );

    const [modalData, setModalData] = useState({
        isOpen: false,
        title: "",
        placeholder: "",
        value: "",
        type: "text",
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
    const [previewUrls, setPreviewUrls] = useState<
        {
            id: string;
            type: string;
            url: string;
        }[]
    >([]);
    const [fileAttachments, setFileAttachments] = useState<any[]>([]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const styles = stylesFn(theme);

    const {
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
            Console.error(error);
        }
    };

    const handleUploadFiles = async () => {
        setLoading(true);
        try {
            const [uploadedFiles, uploadedFilesResponse] = await Promise.all([
                uploadAttachments(fileAttachments),
                uploadFiles(files)
            ]);

            const timelineTimestamp = timelineData?.getTime() || 0;

            setTimeout(() => {
                setLoading(false);
                setProcessMessage("");
                setProcessPercentage(0);
                router.push({
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
            Console.error(error);
            setErrorMessage("Error uploading files");
            setLoading(false);
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

    // const onDateChange = (event: any, selectedDate?: Date) => {
    //   setShowDatePicker(false);
    //   if (selectedDate) {
    //     setTimelineData(selectedDate);
    //   }
    // };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <AppLayout withWebPadding={true}>
            <ScreenHeader title="Apply Now" />
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

            <ApplyNowContent
                note={note}
                quotation={quotation}
                questions={questions}
                answers={answers}
                attachmentLength={files.length}
                setNote={setNote}

                errorMessage={errorMessage}
                loading={loading}

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
                setQuotation={() => {
                    handleModalOrInputPage({
                        isWeb: Platform.OS === "web",
                        openModal,
                        router,
                        fieldTitle: "Enter Quotation",
                        fieldValue: quotation ? "" + quotation : "",
                        setFieldValue: (value) => {
                            const d = value.replace(/[^0-9]/g, "")
                            const quote = d ? parseInt(d) : undefined
                            setQuotation(quote)
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
                }} handleSubmit={handleUploadFiles} />
            <TextModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                title={modalData.title}
                placeholder={modalData.placeholder}
                value={modalData.value}
                type={modalData.type}
                onSubmit={modalData.onSubmit}
            />
        </AppLayout>
    );
};

export default ApplyScreenWeb;
