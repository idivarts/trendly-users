import { useMemo, useState } from "react";
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
import { Platform, Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import SocialButton from "../ui/button/social-button";
import { useFacebookLogin, useInstagramLogin } from "@/hooks/requests";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { INITIAL_USER_DATA } from "@/constants/User";

interface AuthModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const AuthModal: React.FC<AuthModalProps> = ({
  bottomSheetModalRef,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapPoints = useMemo(() => ["35%", "35%", "35%"], []);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const insets = useSafeAreaInsets();
  const containerOffset = useSharedValue({
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  });

  const {
    instagramLogin,
    promptAsyncInstagram,
    requestInstagram,
  } = useInstagramLogin(
    AuthApp,
    FirestoreDB,
    INITIAL_USER_DATA,
    setLoading,
    setError,
  );

  const {
    facebookLogin,
    promptAsyncFacebook,
    requestFacebook,
  } = useFacebookLogin(
    AuthApp,
    FirestoreDB,
    INITIAL_USER_DATA,
    setLoading,
    setError,
  );

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
            <SocialButton
              icon={faFacebook}
              iconColor={Colors(theme).white}
              customStyles={{
                backgroundColor: Colors(theme).primary,
                justifyContent: "center",

              }}
              label="Continue with Facebook"
              labelStyles={{
                color: Colors(theme).white,
              }}
              onPress={() => {
                if (Platform.OS === "web") {
                  facebookLogin();
                } else {
                  if (requestFacebook) {
                    promptAsyncFacebook();
                  }
                }
              }}
            />
            <SocialButton
              icon={faInstagram}
              iconColor={Colors(theme).white}
              customStyles={{
                backgroundColor: Colors(theme).primary,
                justifyContent: "center",

              }}
              label="Continue with Instagram"
              labelStyles={{
                color: Colors(theme).white,
              }}
              onPress={() => {
                if (Platform.OS === "web") {
                  instagramLogin();
                } else {
                  if (requestInstagram) {
                    promptAsyncInstagram();
                  }
                }
              }}
            />
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
