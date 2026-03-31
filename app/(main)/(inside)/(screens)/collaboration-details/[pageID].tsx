import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import BottomSheetActions from "@/components/BottomSheetActions";
import CollaborationDetails from "@/components/collaboration/collaboration-details";
import DetailScreenOverflowMenuButton from "@/components/detail-screens/DetailScreenOverflowMenuButton";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";

const CollaborationDetailsScreen = () => {
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
                    <DetailScreenOverflowMenuButton
                        onPress={() => setIsVisible(true)}
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
