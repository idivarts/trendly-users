import React, { useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme, useTheme } from "@react-navigation/native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { Text, View } from "../theme/Themed";
import Colors from "@/constants/Colors";
import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClockRotateLeft,
  faClose,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button";
import ListItem from "../ui/list-item/ListItem";
import { List } from "react-native-paper";
import QuotationModal from "./quotation-modal";
import TimelineModal from "./timeline-modal";

interface QuotationBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onSubmit: (data: { quotation: string; timeline: number }) => void;
  setState: {
    quotation: React.Dispatch<React.SetStateAction<string>>;
    timeline: React.Dispatch<React.SetStateAction<Date | null>>;
  };
  state: {
    quotation: string;
    timeline: Date | null;
  };
}

const QuotationBottomSheet: React.FC<QuotationBottomSheetProps> = ({
  bottomSheetModalRef,
  onSubmit,
  setState,
  state,
}) => {
  const snapPoints = useMemo(() => ["50%", "50%", "50%"], []);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const [isTimelineModalVisible, setIsTimelineModalVisible] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const insets = useSafeAreaInsets();
  const containerOffset = useSharedValue({
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  });

  const renderBackdrop = (props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleSubmit = () => {
    onSubmit({
      quotation: state.quotation,
      timeline: state.timeline?.getTime() || 0,
    });
  };

  return (
    <>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        containerOffset={containerOffset}
        enablePanDownToClose={true}
        index={2}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        topInset={insets.top}
      >
        <BottomSheetScrollView>
          <View
            style={{
              backgroundColor: Colors(theme).transparent,
              marginHorizontal: 16,
              gap: 16,
            }}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Your Quotation</Text>
              <Pressable onPress={handleClose}>
                <FontAwesomeIcon
                  icon={faClose}
                  color={Colors(theme).primary}
                  size={24}
                />
              </Pressable>
            </View>

            <Text style={styles.subtitle}>Revise your quotation here</Text>

            <List.Section
              style={{
                gap: 16,
                width: "100%",
              }}
            >
              <ListItem
                title="Your Quote"
                leftIcon={faDollarSign}
                rightContent
                content={state.quotation === "" ? "" : "Rs. " + state.quotation}
                onAction={() => {
                  setIsQuotationModalVisible(true);
                }}
              />
              <ListItem
                content={
                  state.timeline ? state.timeline.toLocaleDateString() : ""
                }
                leftIcon={faClockRotateLeft}
                rightContent
                onAction={() => setIsTimelineModalVisible(true)}
                title="Timeline"
              />
            </List.Section>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{
                backgroundColor: Colors(theme).primary,
              }}
            >
              Revise Quotation
            </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      <QuotationModal
        isVisible={isQuotationModalVisible}
        quotation={state.quotation}
        setIsVisible={setIsQuotationModalVisible}
        setQuotation={setState.quotation}
      />

      <TimelineModal
        isVisible={isTimelineModalVisible}
        setIsVisible={setIsTimelineModalVisible}
        setTimeline={setState.timeline}
        timeline={state.timeline}
      />
    </>
  );
};

export default QuotationBottomSheet;

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      flex: 1,
      justifyContent: "center",
    },
    modal: {
      backgroundColor: Colors(theme).card,
      borderRadius: 12,
      gap: 16,
      maxWidth: 400,
      padding: 20,
      width: "90%",
    },
    header: {
      alignItems: "center",
      backgroundColor: Colors(theme).card,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    input: {
      backgroundColor: Colors(theme).card,
      borderColor: Colors(theme).primary,
      textAlignVertical: "top",
    },
    buttonContainer: {
      backgroundColor: Colors(theme).card,
      flexDirection: "row",
      gap: 8,
      justifyContent: "flex-end",
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
    },
    subtitle: {
      color: Colors(theme).gray100,
    },
  });
