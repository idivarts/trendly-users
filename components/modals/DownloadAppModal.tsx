import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Theme, useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBreakpoints } from "@/hooks";
import Colors, { ColorsStatic } from "@/shared-uis/constants/Colors";
import { handleDeepLink } from "@/utils/deeplink";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";

interface DownloadAppModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  collaborationId?: string;
}

const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  bottomSheetModalRef,
  collaborationId,
}) => {
  const snapPoints = useMemo(() => ["25%", "25%", "25%"], []);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    lg,
  } = useBreakpoints();

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
        // style={{ backgroundColor: ColorsStatic.transparent }}
        onPress={() => { handleClose() }}
        onMagicTap={() => { handleClose() }}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      containerOffset={containerOffset}
      enablePanDownToClose={true}
      // index={1}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      topInset={insets.top}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.bottomSheetScrollViewContentContainer}
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.header}
          >
            <Image source={require('@/assets/images/icon.png')} style={{ width: 80, height: 80, borderColor: ColorsStatic.primary, borderWidth: 2, borderRadius: 20 }} />
            <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 16, gap: 8 }}>
              <Text style={styles.headerTitle}>
                Available on AppStore
              </Text>
              <Text style={styles.headerText}>
                Donwload the app now for best user experience
              </Text>
            </View>

            <Pressable
              onPress={handleClose}
              style={{
                zIndex: 10,
              }}
            >
              <FontAwesomeIcon
                color={Colors(theme).primary}
                icon={faClose}
                size={24}
              />
            </Pressable>
          </View>
          <Button
            style={{
              marginTop: 12
            }}
            theme={{
              colors: {
                primary: Colors(theme).primary,
              },
            }}
            onPress={() => {
              if (collaborationId)
                handleDeepLink(`collaboration/${collaborationId}`, lg);
              else
                handleDeepLink(undefined, lg);
            }}
          >
            Download App Now
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal >
  );
};

export default DownloadAppModal;

const stylesFn = (theme: Theme) => StyleSheet.create({
  bottomSheetScrollViewContentContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 50,
  },
  container: {
    justifyContent: "space-between",
    marginHorizontal: 16,
    flex: 1,
  },
  header: {
    alignItems: "flex-start",
    backgroundColor: Colors(theme).transparent,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 18,
    color: Colors(theme).text,
    fontWeight: "600",
    textAlign: "left",
  },
  headerText: {
    fontSize: 16,
    color: Colors(theme).text,
    textAlign: "left",
  },
});
