import ApplyNowContent from "@/components/collaboration/apply-now/ApplyNowContent";
import { useApplication } from "@/components/proposals/useApplication";
import AssetsPreview from "@/components/ui/assets-preview";
import Button from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
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
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AssetItem } from "@/types/Asset";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Toast from "react-native-toast-message";

const EditApplicationScreen = () => {
    const params = useLocalSearchParams();
    const router = useMyNavigation()
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
    const isFocused = useIsFocused();
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

    const [totalFiles, setTotalFiles] = useState(0)

    const theme = useTheme();
    const styles = stylesFn(theme);

    const {
        processMessage,
        setProcessMessage,
        uploadFileUris,
        uploadAttachments,
    } = useAWSContext();

    const { updateApplication } = useApplication()

    // TODO: Use ImagePicker to pick image or Video
    const handleAssetUpload = async () => {
        try {
            // router.push({
            //     pathname: "/apply-now/gallery",
            //     params: {
            //         ...params,
            //         pageID,
            //         note,
            //         path: "/edit-application/[pageID]",
            //         quotation,
            //         //@ts-ignore
            //         timelineData,
            //         selectedFiles: params.selectedFiles,
            //         collaborationId: params.collaborationId,
            //         profileAttachmentsRoute: params.profileAttachments,
            //         originalAttachments: JSON.stringify(originalAttachments),
            //         fileAttachments: JSON.stringify(fileAttachments),
            //         answers: JSON.stringify(answers),
            //     },
            // });
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
        setLoading(true);
        setTotalFiles(1)
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

            // setLoading(false);

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

            setTotalFiles(attachmentToUploadWithParsing.length + finalFilesToUploadWithParsing.length)
            const [uploadedFiles, uploadedFileUrisResponse] = await Promise.all([
                uploadAttachments(attachmentToUploadWithParsing),
                uploadFileUris(finalFilesToUploadWithParsing)
            ]);

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
            // const timelineTimestamp = timelineData?.getTime();

            await updateApplication(params.collaborationId as string, {
                message: note,
                // @ts-ignore
                attachments: finalFilesSending,
                quotation: quotation,
                // timeline: timelineTimestamp,
                // fileAttachments: finalFileAttachment,
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
                router.resetAndNavigate("/collaborations");
            }, 1000);
        } catch (error) {
            Console.error(error);
        } finally {
            setLoading(false);
        }
    };


    // TODO: Identify if this is needed at all
    const getAssetData = async (id: string) => {
        // const asset = await MediaLibrary.getAssetInfoAsync(id);

        return [] as any;
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
            Console.error(error);
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
            setQuotation(applicationData.quotation);
            // setTimelineData(
            //   applicationData.timeline ? new Date(applicationData.timeline) : null
            // );
            // setFileAttachments(applicationData.fileAttachments || []);
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
    }, [isFocused]);

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
            setQuotation(parseInt(params.quotation as string));
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

            <ApplyNowContent
                note={note}
                quotation={quotation}
                questions={questions} answers={answers}
                attachmentLength={finalFiles.length}
                setNote={setNote}
                setQuotation={() => {
                    router.push({
                        pathname: "/apply-now/quotation",
                        params: {
                            title: "Quotation",
                            value: quotation === undefined ? "" : "" + quotation,
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
                    })
                }} setAnswers={(question: string, index: number) => {
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
                            actualQuestion: question,
                            fileAttachments: JSON.stringify(fileAttachments),
                            originalAttachments: JSON.stringify(originalAttachments),
                            answers: JSON.stringify(answers),
                            quotation: quotation,
                            note: note,
                        },
                    });
                }}
                submitText="Update Application"
                handleSubmit={handleUploadFiles}
                handleAssetUpload={handleAssetUpload}
                errorMessage={errorMessage}
                loading={loading}
                FileRenderComponent={<AssetsPreview
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
                        if (originalAttachments.some((file) => file.imageUrl === id)) {
                            setOriginalAttachments((prevFiles) =>
                                prevFiles.filter((file) => file.imageUrl !== id)
                            );
                        }
                    }}
                    handleAssetUpload={handleAssetUpload}
                />} />
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

export default EditApplicationScreen;
