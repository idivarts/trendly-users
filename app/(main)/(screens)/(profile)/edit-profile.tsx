import EditProfile from "@/components/basic-profile/edit-profile";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfileScreen: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
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

  const {
    user,
  } = useAuthContext();

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
            onPress={() => bottomSheetModalRef.current?.present()}
            style={{ padding: 10 }}
          >
            <Text>Preview</Text>
          </Pressable>
        }
      />

      <EditProfile />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        containerOffset={containerOffset}
        topInset={insets.top}
        bottomInset={insets.bottom}
      >
        <BottomSheetScrollView>
          <ProfileBottomSheet
            influencer={user as IUsers}
            theme={theme}
            isBrandsApp={true}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default EditProfileScreen;
