import { IS_BETA_ENABLED } from "@/constants/App";
import { useAuthContext } from "@/contexts";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { View } from "@/shared-uis/components/theme/Themed";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { setStringAsync } from "expo-clipboard";
import { Href } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import ConfirmationModal from "../shared-uis/components/ConfirmationModal";
import TermsAndCondition from "./bottomSheets/TermsAndCondition";
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
  const router = useMyNavigation();
  const sheetRef = React.useRef<BottomSheet>(null);

  const [loading, setLoading] = useState(false)

  const [confirmationModal, setConfirmationModal] = useState<"report" | "block" | null>(null)
  // Adjust snap points for the bottom sheet height
  const snapPoints = React.useMemo(() => [
    snapPointsRange[0], snapPointsRange[1]
  ], []);

  const { user, updateUser } = useAuthContext()

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
    onClose(); // Close the modal after the bottom sheet closes
  };

  const reportCollaboration = async () => {
    setLoading(true);
    try {
      if (!user || !cardId)
        throw new Error("User or collaboration is not defined");
      await updateUser(user.id, {
        moderations: {
          ...(user?.moderations || {}),
          reportedCollaborations: [
            ...(user?.moderations?.reportedCollaborations || []),
            cardId,
          ],
        },
      })
      Toaster.success("Collaboration reported successfully");
    } catch (e) {
      Console.error(e, "Error reporting collaboration");
      Toaster.success("Couldmt report collaboration, please try again later");
    }
    finally {
      setConfirmationModal(null);
      setLoading(false);
    }
  }

  const blockBrands = async () => {
    setLoading(true);
    try {
      if (!user || !cardId)
        throw new Error("User or collaboration is not defined");
      const collaboration = await getDoc(doc(FirestoreDB, "collaborations", cardId));
      if (!collaboration.exists())
        throw new Error("Collaboration does not exist");

      const cData = collaboration.data() as ICollaboration;
      await updateUser(user.id, {
        moderations: {
          ...(user?.moderations || {}),
          blockedBrands: [
            ...(user?.moderations?.blockedBrands || []),
            cData.brandId,
          ],
        },
      })
      Toaster.success("Brand blocked successfully");
    } catch (e) {
      Console.error(e, "Error reporting collaboration");
      Toaster.success("Couldmt report collaboration, please try again later");
    }
    finally {
      setConfirmationModal(null);
      setLoading(false);
    }
  }

  const handleEmailSignIn = () => {
    router.push("/login");
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
      case "invitation":
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
      case "proposal":
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
                router.push(`/edit-application/${cardId}?collaborationId=${cardId}` as Href);
                // http://localhost:8081/edit-application/jEZf51INayY4ZcJs2ck0XWR8Ptj2?collaborationId=fP8GkGwcYgQgNIXExB78
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
              "Are you sure you want to report this collaboration? Your report will be reviewed by our team. You wont be able to see this collaboration again."
              : "Are you sure you want to block this brand? You will not receive any further collaborations from them."
          }
          loading={loading}
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
