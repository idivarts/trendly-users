import ApplyNowContent from "@/components/collaboration/apply-now/ApplyNowContent";
import AssetsPreview from "@/components/ui/assets-preview";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { AssetItem } from "@/types/Asset";
import * as MediaPicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

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
    const [questions, setQuestions] = useState<string[]>([]);

    const [timelineData, setTimelineData] = useState<Date | null>(null);

    const [answers, setAnswers] = useState<{ [key: string]: string }>(
        params.answers ? JSON.parse(params.answers as string) : {}
    );
    const router = useMyNavigation()

    const {
        uploadFileUris,
    } = useAWSContext();

    const handleImageUpload = async (id: string, uri: string) => {
        setFiles([...files, {
            id: id,
            type: 'image',
            localUri: uri,
            uri: uri,
        }])
        console.log("IMAGE ASSET: ", id, uri);
    }

    const handleVideoUpload = async (id: string, uri: string) => {
        setFiles([...files, {
            id: id,
            type: 'video',
            localUri: uri,
            uri: uri,
        }])
    }
    const openGallery = async () => {
        const { status } = await MediaPicker.getMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            const { status } = await MediaPicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                return
            };
        }

        const result = await MediaPicker.launchImageLibraryAsync({
            mediaTypes: MediaPicker.MediaTypeOptions.All,
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].type === 'video') {
            handleVideoUpload(result.assets[0].assetId as string, result.assets[0].uri);
        } else if (!result.canceled) {
            handleImageUpload(result.assets[0].assetId as string, result.assets[0].uri);
        }
    }

    // TODO: Use ImagePicker to pick image or Video
    const handleAssetUpload = async () => {
        try {
            openGallery()
        } catch (e) {
            Console.error(e);
            setErrorMessage("Error uploading file");
        }
    };

    const handleUploadFiles = async () => {
        try {
            const filesWithoutProfileAttachments = // if file uri starts with https, it is a profile attachment and should be removed
                files.filter((file) => !file.uri.startsWith("https"));

            setLoading(true);
            const uploadedFileUrisResponse = await uploadFileUris(filesWithoutProfileAttachments);

            const finalFiles = [
                ...uploadedFileUrisResponse,
            ];

            router.push({
                pathname: "/apply-now/preview",
                params: {
                    ...params,
                    pageID,
                    note,
                    attachments: JSON.stringify(finalFiles),
                    quotation: quotation,
                    answers: JSON.stringify(answers),
                },
            });
        } catch (error) {
            Console.error(error);
        } finally {
            setLoading(false);
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
            setFiles(JSON.parse(params.selectedFiles as string))
        }
        if (params.quotation) {
            setQuotation(params.quotation ? parseInt(params.quotation as string) : undefined);
        }

        if (params.timelineData) {
            setTimelineData(new Date(params.timelineData as string));
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

                errorMessage={errorMessage}
                loading={loading}

                FileRenderComponent={<AssetsPreview
                    files={files.map((file) => ({
                        id: file.id,
                        type: file.type,
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
                            selectedFiles: JSON.stringify(files),
                            placeholder: "Add your quotation",
                            //@ts-ignore
                            timelineData: timelineData,
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
                            selectedFiles: JSON.stringify(files),
                            actualQuestion: question,
                            placeholder: "",
                            //@ts-ignore
                            timelineData: timelineData,
                            answers: JSON.stringify(answers),
                            quotation: quotation,
                            note: note,
                        },
                    });
                }}
                handleSubmit={handleUploadFiles} />
        </AppLayout>
    );
};

export default ApplyScreen;
