import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, usePathname } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";

import CollaborationDetails from "@/components/collaboration/collaboration-details";
import AuthModal from "@/components/modals/AuthModal";
import { Text } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { signInAnonymously } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
;

const CollaborationDetailsScreen = () => {
  const {
    collaborationId,
  } = useLocalSearchParams();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const authModalBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const router = useMyNavigation();
  const {
    lg,
  } = useBreakpoints();

  const theme = useTheme();

  const {
    user,
  } = useAuthContext();

  const renderBottomSheet = useCallback(() => {
    if (Platform.OS === "web" && !lg && pathname.includes("collaboration/") && collaborationId) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

  useEffect(() => {
    renderBottomSheet();
  }, []);

  useEffect(() => {
    if (!pathname.includes("collaboration/") && !collaborationId) return;

    if (user) {
      router.replace(`/collaboration-details/${collaborationId}`);
    } else {
      signInAnonymously(AuthApp).then(() => { setLoading(false) });
    }
  }, [user]);

  if (pathname == "/collaboration" && user)
    router.replace(`/collaborations`);

  return (
    <AppLayout>
      <Appbar.Header
        style={{
          backgroundColor: Colors(theme).background,
          elevation: 0,
          marginHorizontal: 16,
        }}
        statusBarHeight={0}
      >
        <Text
          style={{
            color: Colors(theme).text,
            flex: 1,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Trendly
        </Text>

        <Button
          onPress={() => {
            authModalBottomSheetModalRef.current?.present();
          }}
        >
          Register Now
        </Button>
      </Appbar.Header>
      {!loading ? <CollaborationDetails
        pageID={collaborationId as string}
        cardType="public-collaboration"
      /> : <ActivityIndicator size="small" color={Colors(theme).primary} />}

      <AuthModal
        bottomSheetModalRef={authModalBottomSheetModalRef}
      />
    </AppLayout>
  );
};

export default CollaborationDetailsScreen;
