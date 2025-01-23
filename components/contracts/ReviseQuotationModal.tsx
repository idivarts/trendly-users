import Colors from "@/constants/Colors";
import {
  faClockRotateLeft,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import ListItem from "../ui/list-item/ListItem";
import { router, useLocalSearchParams } from "expo-router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Button from "../ui/button";

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeline, setTimeline] = useState<Date | null>();
  const [quotation, setQuotation] = useState("");
  const params = useLocalSearchParams();

  const updateApplication = async () => {
    try {
      if (!application) return;
      const applicationRef = doc(
        FirestoreDB,
        "collaborations",
        application?.collaborationId,
        "applications",
        application?.id
      );
      await updateDoc(applicationRef, {
        quotation: quotation,
        timeline: timeline?.getTime(),
      });
      Toaster.success("Quotation updated successfully");
      onDismiss();
      refreshData();
    } catch (error) {
      Toaster.error("Error updating quotation");
      console.error("Error updating quotation", error);
    }
  };

  useEffect(() => {
    if (application) {
      const date = new Date(application.timeline);
      setTimeline(date);
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
          content={quotation === "" ? "" : "Rs. " + quotation}
          onAction={() => {
            onDismiss();
            router.push({
              pathname: "/apply-now/quotation",
              params: {
                title: "Quotation",
                value: quotation === "" ? "" : quotation,
                path: `/contract-details/${contractId}`,
                placeholder: "Add your quotation",
              },
            });
          }}
        />
        <ListItem
          title="Timeline"
          leftIcon={faClockRotateLeft}
          rightContent
          content={timeline ? timeline.toLocaleDateString() : ""}
          onAction={() => setShowDatePicker(true)}
        />
        <Button mode="contained" style={{}} onPress={updateApplication}>
          Revise Quotation
        </Button>
      </View>
      {showDatePicker && (
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
      )}
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
