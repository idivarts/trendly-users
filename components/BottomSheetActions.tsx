import React from "react";
import { Modal, Pressable, StyleSheet, View, Dimensions } from "react-native";
import { List } from "react-native-paper";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

interface BottomSheetActionsProps {
  cardType: "collaboration" | "proposal" | "invitation" | "details";
  cardId: string;
  isVisible: boolean;
  snapPointsRange: [string, string];
  onClose: () => void;
}

const BottomSheetActions = ({
  cardType,
  cardId,
  isVisible,
  snapPointsRange,
  onClose,
}: BottomSheetActionsProps) => {
  const router = useRouter();
  const sheetRef = React.useRef<BottomSheet>(null);

  // Adjust snap points for the bottom sheet height
  const snapPoints = React.useMemo(
    () => [snapPointsRange[0], snapPointsRange[1]],
    []
  );

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
    onClose(); // Close the modal after the bottom sheet closes
  };

  const renderContent = () => {
    switch (cardType) {
      case "collaboration":
        return (
          <View style={{ padding: 20 }}>
            <List.Item
              title="View"
              onPress={() => {
                router.push(`/collaboration-details/${cardId}`);
                handleClose();
              }}
            />
            <List.Item
              title="Apply Now"
              onPress={() => {
                router.push(`/apply-now/${cardId}`);
                handleClose();
              }}
            />
            <List.Item
              title="Report"
              onPress={() => {
                router.push("/report");
                handleClose();
              }}
            />
          </View>
        );
      case "proposal":
        return (
          <>
            <List.Item
              title="Reject"
              onPress={() => {
                router.push("/edit-proposal");
                handleClose();
              }}
            />
            <List.Item
              title="View"
              onPress={() => {
                router.push(`/collaboration-details/${cardId}`);
                handleClose();
              }}
            />
          </>
        );
      case "details":
        return (
          <>
            <List.Item
              title="Apply Now"
              onPress={() => {
                router.push(`/apply-now/${cardId}`);
                handleClose();
              }}
            />
            <List.Item
              title="Report"
              onPress={() => {
                router.push("/report");
                handleClose();
              }}
            />
          </>
        );
      case "invitation":
        return (
          <>
            <List.Item
              title="Withdraw"
              onPress={() => {
                router.push("/withdraw");
                handleClose();
              }}
            />
            <List.Item
              title="Change Terms"
              onPress={() => {
                router.push("/change-terms");
                handleClose();
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose} // Closes when Android back button is pressed
    >
      {/* Bottom Sheet */}
      <View style={styles.bottomSheetContainer}>
        <BottomSheet
          ref={sheetRef}
          index={0} // Snap to the first point when opened
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={() => {
            // Dismiss when tapping outside
            return <Pressable style={styles.overlay} onPress={handleClose} />;
          }}
          onClose={handleClose}
          style={styles.bottomSheet} // Ensure it's on top of everything
        >
          <BottomSheetView>{renderContent()}</BottomSheetView>
        </BottomSheet>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 2,
  },
  bottomSheet: {
    zIndex: 9999,
  },
});

export default BottomSheetActions;
