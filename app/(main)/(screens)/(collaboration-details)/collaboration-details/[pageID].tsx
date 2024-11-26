import { useState } from "react";
import { IconButton } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

import AppLayout from "@/layouts/app-layout";
import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";

const CollaborationDetailsScreen = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const {
    cardId,
    cardType,
    collaborationID,
    pageID,
  } = useLocalSearchParams();

  return (
    <AppLayout>
      <ScreenHeader
        title="Collaboration Details"
        rightAction
        rightActionButton={
          <IconButton
            icon="dots-vertical"
            onPress={() => {
              setIsVisible(true);
            }}
            iconColor={Colors(theme).text}
          />
        }
      />
      <CollaborationDetails
        cardId={cardId as string}
        cardType={cardType as string}
        collaborationID={collaborationID as string}
        pageID={pageID as string}
      />
      <BottomSheetActions
        cardId={pageID as string}
        cardType="details"
        isVisible={isVisible}
        snapPointsRange={["20%", "50%"]}
        onClose={() => {
          setIsVisible(false);
        }}
      />
    </AppLayout>
  );
};

export default CollaborationDetailsScreen;
