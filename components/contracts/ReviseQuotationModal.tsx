import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useApplication } from "../proposals/useApplication";
import Button from "../ui/button";
import ListItem from "../ui/list-item/ListItem";

interface Application extends IApplications {
    id: string;
}

interface ReviseQuotationModalProps {
    visible: boolean;
    onDismiss: () => void;
    application?: Application;
    contractId: string;
    refreshData: () => void;
}

const ReviseQuotationModal: FC<ReviseQuotationModalProps> = ({
    visible,
    onDismiss,
    application,
    contractId,
    refreshData,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [quotation, setQuotation] = useState<number | undefined>(undefined);
    const params = useLocalSearchParams();
    const router = useMyNavigation();
    const { updateApplication } = useApplication();

    const updateMyApplication = async () => {
        try {
            if (!application) return;
            await updateApplication(application.collaborationId, {
                quotation: quotation,
            });

            Toaster.success("Quotation updated successfully");
            onDismiss();
            refreshData();
        } catch (error) {
            Toaster.error("Error updating quotation");
            Console.error(error);
        }
    };

    useEffect(() => {
        if (application) {
            setQuotation(application.quotation);
        }
    }, [application]);

    useEffect(() => {
        if (params.value) {
            const { textbox } = JSON.parse(params.value as string);
            const { title: routeTitle, value: textBoxValue } = textbox;

            if (routeTitle === "Quotation") {
                setQuotation(textBoxValue);
            }
        }
    }, [params.value]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <TouchableOpacity
                style={styles.backdrop}
                onPress={onDismiss}
                activeOpacity={1}
            />
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Your Quotation</Text>
                <ListItem
                    title="Your Quote"
                    leftIcon={faDollarSign}
                    rightContent
                    content={
                        quotation === undefined ? "(Required)" : "Rs. " + quotation
                    }
                    onAction={() => {
                        onDismiss();
                        router.push({
                            pathname: "/apply-now/quotation",
                            params: {
                                title: "Quotation",
                                value: quotation === undefined ? "" : quotation,
                                path: `/contract-details/${contractId}`,
                                placeholder: "Add your quotation",
                            },
                        });
                    }}
                />
                <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={updateMyApplication}
                >
                    Revise Quotation
                </Button>
            </View>
        </Modal>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: c.backdrop,
        },
        modalContainer: {
            backgroundColor: c.card,
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            gap: 16,
            position: "absolute",
            paddingBottom: 24,
            bottom: 0,
            left: 0,
            right: 0,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: c.text,
        },
        submitButton: {
            alignSelf: "stretch",
        },
    });
}

export default ReviseQuotationModal;
