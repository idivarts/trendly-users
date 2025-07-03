import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { IconButton } from "react-native-paper";

import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";

const CollaborationDetailsScreen = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const { resetAndNavigate } = useMyNavigation()

  const { cardId, cardType, collaborationID, pageID } = useLocalSearchParams();
  if (pageID === undefined || pageID === "undefined") {
    resetAndNavigate("/collaborations");
  }

  return (
    <AppLayout withWebPadding={false}>
      <ScreenHeader
        title="Collaboration Details"
        rightAction
        rightActionButton={
          <IconButton
            icon={() => (
              <FontAwesomeIcon
                icon={faEllipsisV}
                size={20}
                color={Colors(theme).text}
              />
            )}
            onPress={() => {
              setIsVisible(true);
            }}
            iconColor={Colors(theme).text}
          />
        }
      />
      <CollaborationDetails
        cardType={cardType as any}
        pageID={pageID as string}
      />
      <BottomSheetActions
        cardId={pageID as string}
        cardType="details"
        isVisible={isVisible}
        snapPointsRange={["30%", "50%"]}
        onClose={() => {
          setIsVisible(false);
        }}
      />
    </AppLayout>
  );
};

export default CollaborationDetailsScreen;
