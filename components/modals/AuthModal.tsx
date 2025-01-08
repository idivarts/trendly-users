import { useMemo } from "react";
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
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClose, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

interface AuthModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const AuthModal: React.FC<AuthModalProps> = ({
  bottomSheetModalRef,
}) => {
  const snapPoints = useMemo(() => ["35%", "35%", "35%"], []);
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

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      containerOffset={containerOffset}
      enablePanDownToClose={false}
      index={2}
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
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Login / Register</Text>
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

            <Text style={styles.subtitle}>Use your social login to register or login</Text>
          </View>

          <View
            style={{
              gap: 16,
            }}
          >
            <Button
              theme={{
                colors: {
                  primary: Colors(theme).primary,
                },
              }}
              onPress={() => { }}
              customStyles={{
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* <FontAwesomeIcon
                color={Colors(theme).white}
                icon={faFacebook}
                size={24}
                style={{
                  marginRight: 8,
                }}
              /> */}
              <Text
                style={{
                  color: Colors(theme).white,
                }}
              >
                Continue with Facebook
              </Text>
            </Button>
            <Button
              theme={{
                colors: {
                  primary: Colors(theme).primary,
                },
              }}
              onPress={() => { }}
              customStyles={{
                alignItems: "center",
              }}
            >
              {/* <FontAwesomeIcon
                color={Colors(theme).white}
                icon={faInstagram}
                size={24}
                style={{
                  marginRight: 8,
                }}
              /> */}
              <Text
                style={{
                  color: Colors(theme).white,
                }}
              >
                Continue with Instagram
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default AuthModal;

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
