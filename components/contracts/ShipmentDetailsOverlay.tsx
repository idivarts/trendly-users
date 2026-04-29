import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { Text } from "../theme/Themed";
import Button from "../ui/button";
import ContractActionOverlay from "./ContractActionOverlay";

export type ShipmentDetailsOverlayData = {
    courier: string;
    trackingId: string;
    expectedDate: string;
    shipmentNote?: string;
    deliveryProofs?: string[];
};

export interface ShipmentDetailsOverlayProps {
    visible: boolean;
    onClose: () => void;
    details: ShipmentDetailsOverlayData;
}

const ShipmentDetailsOverlay = ({
    visible,
    onClose,
    details,
}: ShipmentDetailsOverlayProps) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <ContractActionOverlay
            visible={visible}
            onClose={onClose}
            mode="auto"
            snapPointsRange={["40%", "75%"]}
            modalMaxWidth={520}
        >
            <ScrollView
                style={styles.shell}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Shipment details</Text>

                <View style={styles.block}>
                    <Text style={styles.label}>Courier</Text>
                    <Text style={styles.value}>{details.courier}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Tracking ID</Text>
                    <Text style={styles.value}>{details.trackingId}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Expected date</Text>
                    <Text style={styles.value}>{details.expectedDate}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Delivery note</Text>
                    <Text style={styles.value}>{details.shipmentNote?.trim() || "N/A"}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Delivery proof</Text>
                    {details.deliveryProofs?.length ? (
                        <View style={styles.proofGrid}>
                            {details.deliveryProofs.map((proofUrl, index) => (
                                <Image
                                    key={`${proofUrl}-${index}`}
                                    source={{ uri: proofUrl }}
                                    style={styles.proofImage}
                                    resizeMode="cover"
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.value}>N/A</Text>
                    )}
                </View>

                <Button mode="contained" style={styles.closeButton} onPress={onClose}>
                    Close
                </Button>
            </ScrollView>
        </ContractActionOverlay>
    );
};

export default ShipmentDetailsOverlay;

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        shell: {
            flex: 1,
            backgroundColor: colors.background,
        },
        contentContainer: {
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28,
        },
        title: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 20,
        },
        block: {
            marginBottom: 16,
        },
        label: {
            fontSize: 13,
            fontWeight: "600",
            color: colors.gray100,
            marginBottom: 4,
        },
        value: {
            fontSize: 16,
            color: colors.text,
            lineHeight: 22,
        },
        proofGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },
        proofImage: {
            width: 120,
            height: 120,
            borderRadius: 8,
            backgroundColor: colors.secondarySurface,
        },
        closeButton: {
            marginTop: 8,
            alignSelf: "stretch",
        },
    });
}
