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
import Colors from "@/shared-uis/constants/Colors";
import { handleDeepLink } from "@/utils/deeplink";
import { faCircleDown, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";

interface DownloadAppModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  collaborationId: string;
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
      index={1}
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
            <FontAwesomeIcon
              color={Colors(theme).primary}
              icon={faCircleDown}
              size={24}
            />
            <Text
              style={styles.headerText}
            >
              Download the app now to get the best experience with Trendly
            </Text>
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
            theme={{
              colors: {
                primary: Colors(theme).primary,
              },
            }}
            onPress={() => {
              handleDeepLink(`collaboration/${collaborationId}`, lg);
            }}
          >
            Download App
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
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
  headerText: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
});
