import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import {
    faDollarSign
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "react-native-paper";
import { useApplication } from "../proposals/useApplication";
import Button from "../ui/button";
import ListItem from "../ui/list-item/ListItem";
;

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
    // const [showDatePicker, setShowDatePicker] = useState(false);
    // const [timeline, setTimeline] = useState<Date | null>();
    const [quotation, setQuotation] = useState<number | undefined>(undefined);
    const params = useLocalSearchParams();
    const router = useMyNavigation()
    const { updateApplication } = useApplication()
    const updateMyApplication = async () => {
        try {
            if (!application) return;
            await updateApplication(application.collaborationId, {
                quotation: quotation,
                // timeline: timeline?.getTime(),
            })

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
            // const date = new Date(application.timeline);
            // setTimeline(date);
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
                style={{
                    flex: 1,
                    backgroundColor: Colors(theme).backdrop,
                }}
                onPress={onDismiss}
            />
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Your Quotation</Text>
                <ListItem
                    title="Your Quote"
                    leftIcon={faDollarSign}
                    rightContent
                    content={quotation === undefined ? "(Required)" : "Rs. " + quotation}
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
                {/* <ListItem
          title="Timeline"
          leftIcon={faClockRotateLeft}
          rightContent
          content={timeline ? timeline.toLocaleDateString() : ""}
          onAction={() => setShowDatePicker(true)}
        /> */}
                <Button mode="contained" style={{}} onPress={updateMyApplication}>
                    Revise Quotation
                </Button>
            </View>
            {/* {showDatePicker && (
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <DateTimePicker
            value={timeline || new Date()} // Use the selected date or current date
            mode="date" // Show the date picker
            display="spinner" // Use spinner for iOS
            onChange={(event: any, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setTimeline(selectedDate);
              }
            }} // Handle date changes
            themeVariant={theme.dark ? "dark" : "light"}
          />
        </View>
      )} */}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
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
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "gray",
    },
    card: {
        marginBottom: 12,
        elevation: 1,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    addButton: {
        alignSelf: "center",
    },
});

export default ReviseQuotationModal;
