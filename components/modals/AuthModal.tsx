import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Theme, useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IS_BETA_ENABLED } from "@/constants/App";
import Colors from "@/constants/Colors";
import { INITIAL_USER_DATA } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { useFacebookLogin, useInstagramLogin } from "@/hooks/requests";
import { useGoogleLogin } from "@/hooks/requests/use-google-login";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { faFacebook, faGoogle, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Portal } from "react-native-paper";
import ProfileOnboardLoader from "../ProfileOnboardLoader";
import { Text, View } from "../theme/Themed";
import SocialButton from "../ui/button/social-button";

interface AuthModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  collaborationId?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  bottomSheetModalRef,
  collaborationId
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
    requestFacebook,
  } = useFacebookLogin(
    AuthApp,
    FirestoreDB,
    INITIAL_USER_DATA,
    setLoading,
    setError,
  );

  const { setCollaborationId } = useAuthContext()

  useEffect(() => {
    if (collaborationId && setCollaborationId)
      setCollaborationId(collaborationId)
  }, [collaborationId])

  const { googleLogin } = useGoogleLogin(setLoading, setError);

  const renderBackdrop = (props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };
  useEffect(() => {
    if (loading) {
      bottomSheetModalRef.current?.close();
    }
  }, [loading]);

  const handleClose = () => {
    bottomSheetModalRef.current?.dismiss();
  }


  return (
    <>
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
                icon={faGoogle}
                iconColor={Colors(theme).white}
                customStyles={{
                  backgroundColor: Colors(theme).primary,
                  justifyContent: "center",

                }}
                label="Continue with Google"
                labelStyles={{
                  color: Colors(theme).white,
                }}
                onPress={googleLogin}
              />
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
                      facebookLogin();
                    }
                  }
                }}
              />
              {IS_BETA_ENABLED &&
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
                        instagramLogin();
                      }
                    }
                  }}
                />}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      {loading && <Portal>
        <ProfileOnboardLoader />
      </Portal>}
    </>
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
