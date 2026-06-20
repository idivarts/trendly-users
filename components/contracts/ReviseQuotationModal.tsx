import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useApplication } from "../proposals/useApplication";
import Button from "../ui/button";
import ListItem from "../ui/list-item/ListItem";
import ContractActionOverlay from "./ContractActionOverlay";

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
        <ContractActionOverlay
            visible={visible}
            onClose={onDismiss}
            mode="auto"
            snapPointsRange={["42%", "72%"]}
            modalMaxWidth={520}
        >
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
        </ContractActionOverlay>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        modalContainer: {
            backgroundColor: c.card,
            padding: 16,
            paddingBottom: 24,
            gap: 16,
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
