import { IS_BETA_ENABLED } from "@/constants/App";
import { Console } from "@/shared-libs/utils/console";
import { View } from "@/shared-uis/components/theme/Themed";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { setStringAsync } from "expo-clipboard";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import TermsAndCondition from "./bottomSheets/TermsAndCondition";
import ConfirmationModal from "./ui/modal/ConfirmationModal";
interface BottomSheetActionsProps {
  cardType:
  | "collaboration"
  | "proposal"
  | "invitation"
  | "details"
  | "pre-signin"
  | "terms-condition";
  cardId?: string;
  invitationId?: string | null;
  isVisible: boolean;
  snapPointsRange: [string, string];
  onClose: () => void;
}

const BottomSheetActions = ({
  cardType,
  cardId,
  isVisible,
  invitationId,
  snapPointsRange,
  onClose,
}: BottomSheetActionsProps) => {
  const router = useRouter();
  const sheetRef = React.useRef<BottomSheet>(null);

  const [confirmationModal, setConfirmationModal] = useState<"report" | "block" | null>(null)
  // Adjust snap points for the bottom sheet height
  const snapPoints = React.useMemo(() => [
    snapPointsRange[0], snapPointsRange[1]
  ], []);

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
    onClose(); // Close the modal after the bottom sheet closes
  };

  const reportCollaboration = () => {
    // Logic to report the collaboration
    Toaster.success("Collaboration reported successfully");
    setConfirmationModal(null);
  }
  const blockBrands = () => {
    // Logic to block the brand
    Toaster.success("Brand blocked successfully");
    setConfirmationModal(null);
  }
  const handleEmailSignIn = () => {
    router.navigate("/login");
  };

  const renderContent = () => {
    switch (cardType) {
      case "collaboration":
        return (
          <List.Section style={{ paddingBottom: 28 }}>
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
              title="Report Collaboration"
              onPress={() => {
                handleClose();
                Console.log("report collaboration clicked");
                setConfirmationModal("report")
              }}
            />
            <List.Item
              title="Block Brand"
              onPress={() => {
                handleClose();
                setConfirmationModal("block")
              }}
            />
          </List.Section>
        );
      case "proposal":
        return (
          <List.Section style={{ paddingBottom: 28 }}>
            <List.Item
              title="Reject"
              onPress={() => {
                router.push("/edit-proposal" as Href);
                handleClose();
              }}
            />
            <List.Item
              title="View"
              onPress={() => {
                router.push({
                  //@ts-ignore
                  pathname: `/collaboration-details/${cardId}`,
                  params: {
                    cardType: "invitation",
                    cardId: invitationId,
                  },
                });
                handleClose();
              }}
            />
          </List.Section>
        );
      case "details":
        return (
          <List.Section style={{ paddingBottom: 28 }}>
            <List.Item
              title="Report Collaboration"
              onPress={() => {
                handleClose();
                setConfirmationModal("report")
              }}
            />
            <List.Item
              title="Block Brand"
              onPress={() => {
                handleClose();
                setConfirmationModal("block")
              }}
            />
            <List.Item
              title="Copy Collaboration Link"
              onPress={() => {
                setStringAsync(`https://creators.trendly.now/collaboration/${cardId}`)
                Toaster.success("Link copied to clipboard");
                handleClose();
              }}
            />
          </List.Section>
        );
      case "invitation":
        return (
          <List.Section style={{ paddingBottom: 28 }}>
            <List.Item
              title="Withdraw"
              onPress={() => {
                router.push("/withdraw" as Href);
                handleClose();
              }}
            />
            <List.Item
              title="Change Terms"
              onPress={() => {
                router.push("/change-terms" as Href);
                handleClose();
              }}
            />
          </List.Section>
        );
      case "pre-signin":
        return (
          <List.Section style={{ paddingBottom: 28 }}>
            <List.Item
              title="Proceed with Email"
              onPress={() => {
                handleEmailSignIn();
                handleClose();
              }}
            />
            {IS_BETA_ENABLED && <List.Item
              title="Proceed as Guests"
              onPress={() => {
                // handleInstagramSignIn();
                // handleClose();
              }}
            />}

          </List.Section>
        );
      case "terms-condition":
        return <TermsAndCondition />
      default:
        return null;
    }
  };

  return (
    <>
      {isVisible &&
        <Modal
          visible={true}
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
        </Modal>}
      {confirmationModal !== null &&
        <ConfirmationModal
          cancelAction={() => setConfirmationModal(null)}
          confirmAction={() => { confirmationModal === "report" ? reportCollaboration() : blockBrands() }}
          confirmText={
            confirmationModal === "report" ? "Report" : "Block"
          }
          title={confirmationModal === "report" ? "Report Collaboration" : "Block Brand"}
          description={
            confirmationModal === "report" ?
              "Are you sure you want to report this collaboration? This will notify the brand and may affect your future collaborations."
              : "Are you sure you want to block this brand? You will not receive any further collaborations from them."
          }
          setVisible={(b) => setConfirmationModal(null)}
          visible={true}
        />}
    </>
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
    backgroundColor: "transparent",
  },
  bottomSheet: {
    zIndex: 9999,
  },
});

export default BottomSheetActions;
