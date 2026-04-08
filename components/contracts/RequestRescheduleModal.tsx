import { state8RequestReschedule } from "./api/PostingPending_api";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal as RNModal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { Modal as PaperModal, Portal } from "react-native-paper";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

interface RequestRescheduleModalProps {
    visible: boolean;
    loading?: boolean;
    note: string;
    onClose: () => void;
    onChangeNote: (value: string) => void;
    onSubmit: () => void;
}

const RequestRescheduleModal: React.FC<RequestRescheduleModalProps> = ({
    visible,
    loading = false,
    note,
    onClose,
    onChangeNote,
    onSubmit,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.sheet}
                onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
            >
                <Text style={styles.title}>Ask for Reschedule</Text>
                <Text style={styles.subtitle}>Tell the brand why you need a reschedule</Text>
                <TextInput
                    label="Reason"
                    value={note}
                    onChangeText={onChangeNote}
                    placeholder="Need 2 more days to align with my content calendar."
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />
                <View style={styles.actions}>
                    <Button mode="outlined" style={styles.button} onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={onSubmit}
                        disabled={loading || !note.trim()}
                    >
                        {loading ? "Submitting..." : "Confirm"}
                    </Button>
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );

    if (Platform.OS !== "web") {
        return (
            <RNModal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>{modalContent}</View>
            </RNModal>
        );
    }

    return (
        <Portal>
            <PaperModal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={styles.modalContainer}
            >
                {modalContent}
            </PaperModal>
        </Portal>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    const isNative = Platform.OS !== "web";
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.backdrop,
            justifyContent: "flex-end",
        },
        modalContainer: {
            backgroundColor: colors.background,
            borderRadius: 20,
            marginHorizontal: 12,
            maxWidth: 560,
            alignSelf: "center",
            width: "95%",
        },
        keyboardView: {
            width: "100%",
            ...(isNative ? { maxHeight: "90%" } : {}),
        },
        sheet: {
            backgroundColor: colors.background,
            borderTopLeftRadius: isNative ? 28 : 20,
            borderTopRightRadius: isNative ? 28 : 20,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            width: "100%",
        },
        title: {
            fontSize: 40 / 2,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 15,
            color: colors.text,
            marginBottom: 12,
        },
        input: {
            marginBottom: 18,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
        },
        button: {
            minWidth: 120,
        },
    });
}

export default RequestRescheduleModal;

export type RequestRescheduleModalRunWithRefresh = (
    fn: () => Promise<void>,
    successMessage: string
) => Promise<void>;

export function useRequestRescheduleModal(options: {
    contractId: string;
    runWithRefresh: RequestRescheduleModalRunWithRefresh;
}) {
    const { contractId, runWithRefresh } = options;
    const [visible, setVisible] = useState(false);
    const [rescheduleNote, setRescheduleNote] = useState("");
    const rescheduleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rescheduleInFlightRef = useRef(false);

    const open = useCallback(() => setVisible(true), []);

    const close = useCallback(() => {
        setVisible(false);
        setRescheduleNote("");
    }, []);

    useEffect(() => {
        return () => {
            if (rescheduleDebounceRef.current) {
                clearTimeout(rescheduleDebounceRef.current);
            }
        };
    }, []);

    const requestRescheduleWithDebounce = useCallback(async () => {
        if (rescheduleInFlightRef.current || rescheduleDebounceRef.current) return;
        rescheduleInFlightRef.current = true;
        rescheduleDebounceRef.current = setTimeout(() => {
            rescheduleDebounceRef.current = null;
        }, 1500);
        try {
            await runWithRefresh(
                async () => {
                    const trimmed = rescheduleNote.trim();
                    if (!trimmed) throw new Error("Please add a reason for reschedule.");
                    await state8RequestReschedule({
                        contractId,
                        note: trimmed,
                    });
                    close();
                },
                "Reschedule request sent."
            );
        } finally {
            rescheduleInFlightRef.current = false;
        }
    }, [contractId, rescheduleNote, runWithRefresh, close]);

    const requestRescheduleModalProps = useMemo(
        () => ({
            visible,
            note: rescheduleNote,
            onClose: close,
            onChangeNote: setRescheduleNote,
            onSubmit: requestRescheduleWithDebounce,
        }),
        [visible, rescheduleNote, close, requestRescheduleWithDebounce]
    );

    return { open, requestRescheduleModalProps };
}

