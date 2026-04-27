import { state8RequestReschedule } from "./api/PostingPending_api";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import ContractActionOverlay from "./ContractActionOverlay";

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
    const insets = useSafeAreaInsets();

    const modalContent = (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            keyboardVerticalOffset={Platform.OS === "ios" ? Math.max(insets.top, 12) + 48 : 0}
            style={styles.keyboardView}
        >
            <Pressable
                style={styles.inner}
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

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={onClose}
            mode="auto"
            snapPointsRange={["96%", "96%"]}
            modalMaxWidth={520}
        >
            <View style={styles.contentShell}>{modalContent}</View>
        </ContractActionOverlay>
    );
};

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

