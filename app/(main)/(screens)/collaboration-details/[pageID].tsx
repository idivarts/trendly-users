import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { IconButton } from "react-native-paper";

import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { resetAndNavigate } from "@/utils/router";

const CollaborationDetailsScreen = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const { cardId, cardType, collaborationID, pageID } = useLocalSearchParams();
  if (pageID === undefined || pageID === "undefined") {
    resetAndNavigate("/collaborations");
  }

  return (
    <AppLayout withWebPadding={true}>
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
