import { useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme, useTheme } from "@react-navigation/native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Text, View } from "../theme/Themed";
import Colors from "@/constants/Colors";
import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClose, faPaperclip, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button";
import ListItem from "../ui/list-item/ListItem";
import { List } from "react-native-paper";
import { useRouter } from "expo-router";

interface QuotationModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const QuotationModal: React.FC<QuotationModalProps> = ({
  bottomSheetModalRef,
}) => {
  const snapPoints = useMemo(() => ["50%", "50%", "50%"], []);
  const [quotation, setQuotation] = useState("");
  const [timelineData, setTimelineData] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTimelineData(selectedDate);
    }
  };

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
  }

  const handleSubmit = () => {
    console.log('Submit');
  }

  return (
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
            <Pressable
              onPress={handleClose}
            >
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
              leftIcon={faQuoteLeft}
              content={quotation === "" ? "" : "Rs. " + quotation}
              onAction={() => {
                bottomSheetModalRef.current?.dismiss();
                router.push({
                  pathname: "/apply-now/quotation",
                  params: {
                    // title: "Quotation",
                    // value: quotation === "" ? "" : quotation,
                    // path: `/apply-now/${pageID}`,
                    // selectedFiles: params.selectedFiles,
                    // profileAttachments: params.profileAttachments,
                    // placeholder: "Add your quotation",
                    // //@ts-ignore
                    // timelineData: timelineData,
                    // fileAttachments: JSON.stringify(fileAttachments),
                    // answers: JSON.stringify(answers),
                    // note: note,
                  },
                });
              }}
            />
            <ListItem
              content={timelineData ? timelineData.toLocaleDateString() : ""}
              leftIcon={faPaperclip}
              onAction={() => setShowDatePicker(true)}
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

        {
          showDatePicker && (
            <DateTimePicker
              display="spinner"
              mode="date"
              onChange={onDateChange}
              value={timelineData || new Date()}
            />
          )
        }
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default QuotationModal;

const stylesFn = (theme: Theme) => StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors(theme).gray100,
  },
});