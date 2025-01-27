import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";

import { Text } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import DownloadAppModal from "@/components/modals/DownloadAppModal";
import { useCallback, useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Platform } from "react-native";
import { useBreakpoints } from "@/hooks";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import AuthModal from "@/components/modals/AuthModal";
import { useAuthContext } from "@/contexts";
import { AuthApp } from "@/utils/auth";
import { signInAnonymously } from "firebase/auth";

const CollaborationDetailsScreen = () => {
  const {
    collaborationId,
  } = useLocalSearchParams();
  const pathname = usePathname();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const authModalBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const router = useRouter();
  const {
    lg,
  } = useBreakpoints();

  const theme = useTheme();

  const {
    user,
  } = useAuthContext();

  const renderBottomSheet = useCallback(() => {
    if (Platform.OS === "web" && !lg && pathname.includes("collaboration") && collaborationId) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

  useEffect(() => {
    renderBottomSheet();
  }, []);

  useEffect(() => {
    if (!pathname.includes("collaboration") && !collaborationId) return;

    if (user) {
      router.replace(`/collaboration-details/${collaborationId}`);
    } else {
      signInAnonymously(AuthApp);
    }
  }, [user]);

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
      <CollaborationDetails
        pageID={collaborationId as string}
        cardId={null as any}
        cardType="public-collaboration"
        collaborationID={collaborationId as string}
      />
      <DownloadAppModal
        bottomSheetModalRef={bottomSheetModalRef}
        collaborationId={collaborationId as string}
      />
      <AuthModal
        bottomSheetModalRef={authModalBottomSheetModalRef}
      />
    </AppLayout>
  );
};

export default CollaborationDetailsScreen;
