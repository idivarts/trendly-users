import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Text } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import DownloadAppModal from "@/components/modals/DownloadAppModal";
import { useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Platform } from "react-native";
import { useBreakpoints } from "@/hooks";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import AuthModal from "@/components/modals/AuthModal";
import { useAuthContext } from "@/contexts";

const CollaborationDetailsScreen = () => {
  const {
    collaborationId,
  } = useLocalSearchParams();

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

  useEffect(() => {
    if (Platform.OS === "web" && !lg) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(`/collaboration-details/${collaborationId}`);
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
