import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import Button from "../ui/button";
import ContractActionOverlay from "./ContractActionOverlay";
import { respondToCancellationAsInfluencer } from "./api/DisputeCancellation_api";
import type { CancellationRequest } from "@/shared-libs/firestore/trendly-pro/models/contracts";

interface RespondToCancellationModalProps {
    visible: boolean;
    loading?: boolean;
    cancellationRequest: CancellationRequest;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}

const RespondToCancellationModal: React.FC<RespondToCancellationModalProps> = ({
    visible,
    loading = false,
    cancellationRequest,
    onClose,
    onApprove,
    onReject,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const requestedDate = cancellationRequest.requestedAt
        ? new Date(cancellationRequest.requestedAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : null;

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={loading ? () => undefined : onClose}
            mode="auto"
            snapPointsRange={["60%", "75%"]}
            modalMaxWidth={480}
        >
            <View style={styles.contentShell}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Cancellation Request</Text>
                    <Text style={styles.subtitle}>
                        The brand has requested to cancel this contract. Please review and respond.
                    </Text>

                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonLabel}>Reason given by brand</Text>
                        <Text style={styles.reasonText}>
                            {cancellationRequest.reason || "No reason provided."}
                        </Text>
                        {requestedDate ? (
                            <Text style={styles.requestedDate}>Requested on {requestedDate}</Text>
                        ) : null}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>
                            If you approve, the contract will be cancelled and a refund (if applicable) will be processed based on the current stage.
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            style={styles.rejectButton}
                            onPress={onReject}
                            disabled={loading}
                        >
                            Reject
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.approveButton}
                            onPress={onApprove}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Approve"}
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </ContractActionOverlay>
    );
};

export default RespondToCancellationModal;

export function useRespondToCancellationModal(options: {
    contractId: string;
    runWithRefresh: (fn: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
    const { contractId, runWithRefresh } = options;
    const [visible, setVisible] = useState(false);

    const open = useCallback(() => setVisible(true), []);
    const close = useCallback(() => setVisible(false), []);

    const handleApprove = useCallback(
        () =>
            runWithRefresh(async () => {
                await respondToCancellationAsInfluencer({ contractId, approve: true });
                close();
            }, "Cancellation approved. The contract has been cancelled."),
        [contractId, runWithRefresh, close]
    );

    const handleReject = useCallback(
        () =>
            runWithRefresh(async () => {
                await respondToCancellationAsInfluencer({ contractId, approve: false });
                close();
            }, "Cancellation request rejected."),
        [contractId, runWithRefresh, close]
    );

    return { open, close, visible, handleApprove, handleReject };
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
        scrollView: {
            width: "100%",
        },
        scrollContent: {
            paddingBottom: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 6,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 16,
        },
        reasonCard: {
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 14,
            marginBottom: 12,
            gap: 6,
        },
        reasonLabel: {
            fontSize: 12,
            fontWeight: "700",
            color: colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.6,
        },
        reasonText: {
            fontSize: 15,
            color: colors.text,
            lineHeight: 22,
        },
        requestedDate: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
        },
        infoCard: {
            backgroundColor: colors.secondarySurface,
            borderWidth: 1,
            borderColor: colors.secondaryBorder,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 20,
        },
        infoText: {
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 19,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
        },
        rejectButton: {
            minWidth: 100,
        },
        approveButton: {
            minWidth: 120,
        },
    });
}
