import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import ContractActionOverlay from "./ContractActionOverlay";
import {
    raiseDisputeAsInfluencer,
    type RaiseDisputePayload,
} from "./api/DisputeCancellation_api";
import type { AssetItem } from "@/shared-libs/types/Asset";
import { Subject, type Subscription } from "rxjs";
import { ProgressBar } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowUpFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";

const DISPUTE_TYPES: { value: string; label: string }[] = [
    { value: "shipment_not_received", label: "Product Not Received" },
    { value: "shipment_damaged", label: "Product Damaged / Wrong Item" },
    { value: "revision_abuse", label: "Excessive Revision Requests" },
    { value: "terms_violation", label: "Brand Not Honoring Agreed Terms" },
    { value: "payment_not_received", label: "Payment Not Received" },
    { value: "other", label: "Other" },
];

interface RaiseDisputeModalProps {
    visible: boolean;
    loading?: boolean;
    isUploading?: boolean;
    step: number;
    selectedType: string;
    description: string;
    evidenceUris: string[];
    uploadProgress: number;
    onClose: () => void;
    onSelectType: (type: string) => void;
    onChangeDescription: (val: string) => void;
    onNextStep: () => void;
    onPickEvidence: () => void;
    onRemoveEvidence: (index: number) => void;
    onSubmit: () => void;
}

const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
    visible,
    loading = false,
    isUploading = false,
    step,
    selectedType,
    description,
    evidenceUris,
    uploadProgress,
    onClose,
    onSelectType,
    onChangeDescription,
    onNextStep,
    onPickEvidence,
    onRemoveEvidence,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const effectiveOnClose = isUploading || loading ? () => undefined : onClose;

    const stepTitles = ["Select Dispute Type", "Describe the Issue", "Add Evidence (Optional)"];

    const canProceedStep1 = !!selectedType;
    const canProceedStep2 = description.trim().length >= 10;

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={effectiveOnClose}
            mode="auto"
            snapPointsRange={["96%", "96%"]}
            modalMaxWidth={520}
        >
            <View style={styles.contentShell}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <Pressable
                        style={styles.inner}
                        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
                    >
                        <View style={styles.header}>
                            <View style={styles.stepIndicator}>
                                {[0, 1, 2].map((i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.stepDot,
                                            i === step ? styles.stepDotActive : i < step ? styles.stepDotDone : undefined,
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.title}>Raise a Dispute</Text>
                            <Text style={styles.subtitle}>{stepTitles[step]}</Text>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {step === 0 && (
                                <View style={styles.typeList}>
                                    {DISPUTE_TYPES.map((dt) => (
                                        <Pressable
                                            key={dt.value}
                                            style={[
                                                styles.typeOption,
                                                selectedType === dt.value && styles.typeOptionSelected,
                                            ]}
                                            onPress={() => onSelectType(dt.value)}
                                        >
                                            <Text
                                                style={[
                                                    styles.typeOptionLabel,
                                                    selectedType === dt.value && styles.typeOptionLabelSelected,
                                                ]}
                                            >
                                                {dt.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}

                            {step === 1 && (
                                <>
                                    <TextInput
                                        label="Description"
                                        value={description}
                                        onChangeText={onChangeDescription}
                                        placeholder="Describe the issue in detail (min 10 characters)..."
                                        multiline
                                        numberOfLines={5}
                                        style={styles.descInput}
                                    />
                                    <Text style={styles.helperText}>
                                        Be specific — include dates, amounts, or any relevant details.
                                    </Text>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Text style={styles.evidenceHint}>
                                        Upload screenshots or photos as evidence (up to 3). This step is optional.
                                    </Text>
                                    <View style={styles.evidenceGrid}>
                                        {evidenceUris.map((uri, index) => (
                                            <View key={uri} style={styles.evidenceItem}>
                                                <Image source={{ uri }} style={styles.evidenceImage} resizeMode="cover" />
                                                <Pressable
                                                    style={styles.evidenceRemove}
                                                    onPress={() => onRemoveEvidence(index)}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} size={12} color={colors.background} />
                                                </Pressable>
                                            </View>
                                        ))}
                                        {evidenceUris.length < 3 && (
                                            <Pressable style={styles.evidenceAdd} onPress={onPickEvidence}>
                                                <FontAwesomeIcon
                                                    icon={faArrowUpFromBracket}
                                                    size={24}
                                                    color={colors.textSecondary}
                                                />
                                            </Pressable>
                                        )}
                                    </View>

                                    {isUploading && (
                                        <View style={styles.uploadProgressCard}>
                                            <View style={styles.uploadProgressHeader}>
                                                <Text style={styles.uploadProgressTitle}>Uploading evidence</Text>
                                                <Text style={styles.uploadProgressPercent}>{Math.round(uploadProgress)}%</Text>
                                            </View>
                                            <ProgressBar
                                                progress={Math.min(1, Math.max(0, uploadProgress / 100))}
                                                color={colors.primary}
                                                style={styles.uploadProgressBar}
                                            />
                                        </View>
                                    )}
                                </>
                            )}

                            <View style={styles.actions}>
                                <Button
                                    mode="outlined"
                                    style={styles.button}
                                    onPress={step === 0 ? effectiveOnClose : () => undefined}
                                    disabled={loading || isUploading}
                                >
                                    {step === 0 ? "Cancel" : "Back"}
                                </Button>
                                {step < 2 ? (
                                    <Button
                                        mode="contained"
                                        style={styles.button}
                                        onPress={onNextStep}
                                        disabled={step === 0 ? !canProceedStep1 : !canProceedStep2}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        mode="contained"
                                        style={styles.button}
                                        onPress={onSubmit}
                                        disabled={loading || isUploading}
                                    >
                                        {loading || isUploading ? "Submitting..." : "Submit Dispute"}
                                    </Button>
                                )}
                            </View>
                        </ScrollView>
                    </Pressable>
                </KeyboardAvoidingView>
            </View>
        </ContractActionOverlay>
    );
};

export default RaiseDisputeModal;

export function useRaiseDisputeModal(options: {
    contractId: string;
    uploadFileUri: (
        file: AssetItem,
        subject?: { index: number; subject: Subject<{ index: number; percentage: number }> }
    ) => Promise<{ imageUrl?: string }>;
    runWithRefresh: (fn: () => Promise<void>, successMessage: string) => Promise<void>;
    prefilledType?: string;
}) {
    const { contractId, uploadFileUri, runWithRefresh, prefilledType } = options;
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(0);
    const [selectedType, setSelectedType] = useState(prefilledType ?? "");
    const [description, setDescription] = useState("");
    const [evidenceUris, setEvidenceUris] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const open = useCallback((prefill?: string) => {
        setStep(prefill ? 1 : 0);
        setSelectedType(prefill ?? prefilledType ?? "");
        setDescription("");
        setEvidenceUris([]);
        setUploadProgress(0);
        setIsUploading(false);
        setVisible(true);
    }, [prefilledType]);

    const close = useCallback(() => {
        setVisible(false);
        setStep(0);
        setSelectedType(prefilledType ?? "");
        setDescription("");
        setEvidenceUris([]);
        setUploadProgress(0);
        setIsUploading(false);
    }, [prefilledType]);

    const pickEvidence = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== "granted") {
            Toaster.error("Please allow media permissions to upload evidence.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            setEvidenceUris((prev) => [...prev, result.assets[0].uri]);
        }
    }, []);

    const removeEvidence = useCallback((index: number) => {
        setEvidenceUris((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = useCallback(
        () =>
            runWithRefresh(async () => {
                const uploadedUrls: string[] = [];
                if (evidenceUris.length > 0) {
                    setIsUploading(true);
                    setUploadProgress(0);
                    for (let i = 0; i < evidenceUris.length; i++) {
                        let progressSub: Subscription | undefined;
                        const progressSubject = new Subject<{ index: number; percentage: number }>();
                        try {
                            progressSub = progressSubject.subscribe(({ percentage }) => {
                                const base = (i / evidenceUris.length) * 100;
                                const increment = (percentage / 100) * (100 / evidenceUris.length);
                                setUploadProgress(Math.round(base + increment));
                            });
                            const result = await uploadFileUri(
                                {
                                    id: evidenceUris[i],
                                    localUri: evidenceUris[i],
                                    uri: evidenceUris[i],
                                    type: "image",
                                } as AssetItem,
                                { index: i, subject: progressSubject }
                            );
                            if (result.imageUrl) uploadedUrls.push(result.imageUrl);
                        } finally {
                            progressSub?.unsubscribe();
                            progressSubject.complete();
                        }
                    }
                    setIsUploading(false);
                }

                const payload: RaiseDisputePayload = {
                    contractId,
                    type: selectedType,
                    description: description.trim(),
                    evidence: uploadedUrls,
                };
                await raiseDisputeAsInfluencer(payload);
                close();
            }, "Dispute raised. Our team will review it shortly."),
        [contractId, selectedType, description, evidenceUris, uploadFileUri, runWithRefresh, close]
    );

    const raiseDisputeModalProps = useMemo(
        () => ({
            visible,
            isUploading,
            step,
            selectedType,
            description,
            evidenceUris,
            uploadProgress,
            onClose: close,
            onSelectType: setSelectedType,
            onChangeDescription: setDescription,
            onNextStep: () => setStep((s) => Math.min(s + 1, 2)),
            onPickEvidence: pickEvidence,
            onRemoveEvidence: removeEvidence,
            onSubmit: handleSubmit,
        }),
        [
            visible,
            isUploading,
            step,
            selectedType,
            description,
            evidenceUris,
            uploadProgress,
            close,
            pickEvidence,
            removeEvidence,
            handleSubmit,
        ]
    );

    return { open, raiseDisputeModalProps };
}

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        contentShell: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28,
        },
        keyboardView: {
            flex: 1,
            width: "100%",
        },
        inner: {
            flex: 1,
            width: "100%",
        },
        header: {
            marginBottom: 20,
        },
        stepIndicator: {
            flexDirection: "row",
            gap: 6,
            marginBottom: 12,
        },
        stepDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.secondaryBorder,
        },
        stepDotActive: {
            backgroundColor: colors.primary,
            width: 20,
        },
        stepDotDone: {
            backgroundColor: colors.primary,
            opacity: 0.5,
        },
        title: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        scrollView: {
            width: "100%",
        },
        scrollContent: {
            paddingBottom: 8,
        },
        typeList: {
            gap: 10,
            marginBottom: 16,
        },
        typeOption: {
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: colors.secondaryBorder,
            backgroundColor: colors.secondarySurface,
        },
        typeOptionSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryLight ?? colors.secondarySurface,
        },
        typeOptionLabel: {
            fontSize: 15,
            fontWeight: "500",
            color: colors.text,
        },
        typeOptionLabelSelected: {
            color: colors.primary,
            fontWeight: "700",
        },
        descInput: {
            minHeight: 120,
            marginBottom: 8,
        },
        helperText: {
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 16,
        },
        evidenceHint: {
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 12,
        },
        evidenceGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
        },
        evidenceItem: {
            width: 90,
            height: 90,
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
        },
        evidenceImage: {
            width: "100%",
            height: "100%",
        },
        evidenceRemove: {
            position: "absolute",
            top: 4,
            right: 4,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.errorBannerText ?? colors.red,
            alignItems: "center",
            justifyContent: "center",
        },
        evidenceAdd: {
            width: 90,
            height: 90,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: colors.secondaryBorder,
            borderStyle: "dashed",
            backgroundColor: colors.secondarySurface,
            alignItems: "center",
            justifyContent: "center",
        },
        uploadProgressCard: {
            width: "100%",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
            marginBottom: 12,
            gap: 8,
        },
        uploadProgressHeader: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        uploadProgressTitle: {
            color: colors.text,
            fontSize: 14,
            fontWeight: "600",
        },
        uploadProgressPercent: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: "600",
        },
        uploadProgressBar: {
            height: 8,
            borderRadius: 99,
            backgroundColor: colors.secondaryBorder,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 4,
        },
        button: {
            minWidth: 110,
        },
    });
}
