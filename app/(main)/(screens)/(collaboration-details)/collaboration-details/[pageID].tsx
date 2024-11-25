import { useState } from "react";
import { Appbar, IconButton } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";

import AppLayout from "@/layouts/app-layout";
import Colors from "@/constants/Colors";
import BackButton from "@/components/ui/back-button/BackButton";
import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/collaboration-details";

const CollaborationDetailsScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  const {
    cardId,
    cardType,
    collaborationID,
    pageID,
  } = useLocalSearchParams();

  return (
    <AppLayout>
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: Colors(theme).background,
        }}
      >
        <BackButton />
        <Appbar.Content
          color={Colors(theme).text}
          title="Collaboration Details"
        />
        <IconButton
          icon="dots-vertical"
          onPress={() => {
            setIsVisible(true);
          }}
        />
      </Appbar.Header>
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
