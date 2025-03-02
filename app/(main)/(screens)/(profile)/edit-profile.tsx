import EditProfile from "@/components/basic-profile/edit-profile";
import { Text, View } from "@/components/theme/Themed";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";
import { FirestoreDB } from "@/utils/firestore";
import {
  BottomSheetBackdrop,
  BottomSheetModal
} from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import { Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfileScreen: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const theme = useTheme();

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const insets = useSafeAreaInsets();
  const containerOffset = useSharedValue({
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  });

  const handleSheetChanges = (index: number) => { };
  const closeProfileModal = () => {
    bottomSheetModalRef.current?.close();
  }

  const { user } = useAuthContext();

  const renderBackdrop = (props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Edit Profile"
        rightAction
        rightActionButton={
          <Pressable
            onPress={() => {
              if (unsavedChanges) {
                setConfirmationModalVisible(true);
                return;
              }

              bottomSheetModalRef.current?.present();
            }}
            style={{ padding: 10 }}
          >
            <Text>Preview</Text>
          </Pressable>
        }
      />

      <EditProfile
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        containerOffset={containerOffset}
        topInset={insets.top}
      >
        <ProfileBottomSheet
          influencer={user as IUsers}
          theme={theme}
          FireStoreDB={FirestoreDB}
          isBrandsApp={false}
          closeModal={closeProfileModal}
        />
      </BottomSheetModal>

      <ConfirmationModal
        cancelAction={() => setConfirmationModalVisible(false)}
        confirmAction={() => {
          bottomSheetModalRef.current?.present();
          setConfirmationModalVisible(false);
        }}
        confirmText="Continue"
        description="You have unsaved changes. Are you sure you want to continue?"
        setVisible={setConfirmationModalVisible}
        visible={confirmationModalVisible}
      />
    </View>
  );
};

export default EditProfileScreen;
