import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

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

const CollaborationDetailsScreen = () => {
  const {
    collaborationId,
  } = useLocalSearchParams();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {
    lg,
  } = useBreakpoints();

  const theme = useTheme();

  useEffect(() => {
    if (Platform.OS === "web" && !lg) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

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
          onPress={() => { }}
        >
          Register Now
        </Button>
      </Appbar.Header>
      <CollaborationDetails
        pageID={collaborationId as string}
        cardId={null as any}
        cardType="collaboration"
        collaborationID={collaborationId as string}
      />
      <DownloadAppModal
        bottomSheetModalRef={bottomSheetModalRef}
        collaborationId={collaborationId as string}
      />
    </AppLayout>
  );
};

export default CollaborationDetailsScreen;
