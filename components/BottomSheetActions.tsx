import { IS_BETA_ENABLED } from "@/constants/App";
import { DUMMY_PASSWORD, DUMMY_USER_CREDENTIALS } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { View } from "@/shared-uis/components/theme/Themed";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { setStringAsync } from "expo-clipboard";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { List } from "react-native-paper";
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
    const { signIn } = useAuthContext();

    const handleEmailSignIn = () => {
      router.navigate("/login");
    };

    const handleInstagramSignIn = () => {
      signIn(DUMMY_USER_CREDENTIALS.email!, DUMMY_PASSWORD);
    };

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
            {/* <List.Item
              title="Apply Now"
              onPress={() => {
                router.push(`/apply-now/${cardId}`);
                handleClose();
              }}
            /> */}
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
    backgroundColor: "transparent",
  },
  bottomSheet: {
    zIndex: 9999,
  },
});

export default BottomSheetActions;
