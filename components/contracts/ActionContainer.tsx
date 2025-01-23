import { useTheme } from "@react-navigation/native";
import { Text, View } from "../theme/Themed";
import { FC, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleInfo,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { doc, getDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { useChatContext } from "@/contexts";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { router } from "expo-router";
import ImageComponent from "@/shared-uis/components/image-component";
import Button from "../ui/button";

interface ActionContainerProps {
  contract: IContracts;
  refreshData: () => void;
  feedbackModalVisible: () => void;
  showQuotationModal: () => void;
  userData: IUsers;
}

const ActionContainer: FC<ActionContainerProps> = ({
  contract,
  refreshData,
  showQuotationModal,
  feedbackModalVisible,
  userData,
}) => {
  const theme = useTheme();
  const [manager, setManager] = useState<IManagers>();
  const { sendSystemMessage, fetchChannelCid } = useChatContext();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            size={16}
            color={Colors(theme).yellow}
          />
        ))}
        {hasHalfStar && (
          <FontAwesomeIcon
            icon={faStarHalfStroke}
            size={16}
            color={Colors(theme).yellow}
          />
        )}
      </>
    );
  };

  const fetchManager = async () => {
    if (!contract.feedbackFromBrand?.managerId) return;
    const managerRef = doc(
      FirestoreDB,
      "managers",
      contract.feedbackFromBrand?.managerId
    );
    const manager = await getDoc(managerRef);
    setManager(manager.data() as IManagers);
  };

  useEffect(() => {
    fetchManager();
  }, [contract.feedbackFromBrand?.managerId]);

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        flexDirection: "column",
        gap: 16,
      }}
    >
      {contract.status !== 3 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {contract.status === 0 && (
            <>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  try {
                    sendSystemMessage(
                      contract.streamChannelId,
                      "Let's start the contract"
                    );
                    Toaster.success("Sent message to the brand");
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                Start Contract
              </Button>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={showQuotationModal}
              >
                Revise Quote
              </Button>
            </>
          )}
          {contract.status === 1 && (
            <>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  {
                    try {
                      sendSystemMessage(
                        contract.streamChannelId,
                        "Let's end the contract"
                      );
                      Toaster.success("Sent message to the brand");
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }}
              >
                End Contract
              </Button>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={async () => {
                  const channelCid = await fetchChannelCid(
                    contract.streamChannelId
                  );
                  router.navigate(`/channel/${channelCid}`);
                }}
              >
                Go to Messages
              </Button>
            </>
          )}
          {contract.status === 2 && !contract.feedbackFromInfluencer && (
            <>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={feedbackModalVisible}
              >
                Give Feedback
              </Button>
            </>
          )}
        </View>
      )}
      {contract.feedbackFromBrand && (
        <View
          style={{
            width: "100%",
            borderWidth: 0.3,
            padding: 10,
            borderRadius: 10,
            gap: 10,
            borderColor: Colors(theme).gray300,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {renderStars(contract.feedbackFromBrand.ratings || 0)}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flexGrow: 1,
            }}
          >
            <ImageComponent
              url={manager?.profileImage || ""}
              shape="circle"
              altText="Manager Image"
              initials={manager?.name}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors(theme).text,
                }}
              >
                From Brand ({manager?.name})
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  flexWrap: "wrap",
                  overflow: "hidden",
                  lineHeight: 22,
                  color: Colors(theme).text,
                }}
              >
                {contract.feedbackFromBrand.feedbackReview}
              </Text>
            </View>
          </View>
        </View>
      )}
      {contract.feedbackFromInfluencer && (
        <View
          style={{
            borderWidth: 0.3,
            padding: 10,
            borderRadius: 10,
            gap: 10,
            borderColor: Colors(theme).gray300,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {renderStars(contract.feedbackFromInfluencer.ratings || 0)}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flexGrow: 1,
            }}
          >
            <ImageComponent
              url={userData.profileImage || ""}
              shape="circle"
              altText="User Image"
              initials={userData.name}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors(theme).text,
                }}
              >
                From Influencer ({userData.name})
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  flexWrap: "wrap",
                  overflow: "hidden",
                  lineHeight: 22,
                  color: Colors(theme).text,
                }}
              >
                {contract.feedbackFromInfluencer?.feedbackReview}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View
        style={{
          backgroundColor:
            contract.status === 0 ||
              contract.status === 1 ||
              contract.status === 2
              ? Colors(theme).gold
              : Colors(theme).green,
          padding: 16,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <FontAwesomeIcon icon={faCircleInfo} size={20} />
        <Text style={{ fontSize: 16, width: "95%" }}>
          {contract.status === 0
            ? "Please make sure to use this chat to first understand the the influencer. Post that, you can start your collaboration here"
            : contract.status === 1
              ? "Please note, if your collaboration is done, we would need you to close the collaboration here. Having open collaborations idle for a long time can end up reducing the rating"
              : contract.status === 2
                ? "Feedbacks are important for us. Our platform works on what people give feedback to each other. You see that other persons feedback only if you give your feedback"
                : "You can create new collaboration and invite user to collaboration"}
        </Text>
      </View>
    </View>
  );
};

export default ActionContainer;
