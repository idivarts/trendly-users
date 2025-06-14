import { useChatContext } from "@/contexts";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import ImageComponent from "@/shared-uis/components/image-component";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import {
  faCircleInfo,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";
;

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
  const { fetchChannelCid } = useChatContext();

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
                mode="outlined"
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  try {
                    Toaster.success("Successfully informed brand to start the collaboration");
                    HttpWrapper.fetch(`/api/v1/contracts/${contract.streamChannelId}`, {
                      method: "POST"
                    }).catch(e => {
                      Toaster.error("Successfully went wrong!!");
                    })
                  } catch (e: any) {
                    Console.error(e);
                  }
                }}
              >
                Ask to Start Contract
              </Button>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                }}
                onPress={showQuotationModal}
              >
                Revise Quotation
              </Button>
            </>
          )}
          {contract.status === 1 && (
            <>
              <Button
                mode="contained-tonal"
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  {
                    try {
                      Toaster.success("Successfully informed brand to end the collaboration");
                      HttpWrapper.fetch(`/api/v1/contracts/${contract.streamChannelId}/end`, {
                        method: "POST"
                      }).catch(r => {
                        Toaster.error("Something went wrong");
                      })
                    } catch (e: any) {
                      Console.log(e);
                    }
                  }
                }}
              >
                Ask to End Contract
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
          {contract.status === 2 && (
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
      {contract.status == 3 && contract.feedbackFromBrand && (
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
      {contract.status == 3 && contract.feedbackFromInfluencer && (
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
              ? Colors(theme).yellow
              : Colors(theme).green,
          padding: 16,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <FontAwesomeIcon icon={faCircleInfo} size={20} />
        <Text style={{ fontSize: 16, flex: 1, marginRight: 12 }}>
          {contract.status === 0
            ? "Please make sure you chat with the brands before you ask them to start collaboration."
            : contract.status === 1
              ? "Please note, if your collaboration is done, ask the brand to end the collaboration and rate you."
              : contract.status === 2
                ? "Feedbacks are important for us. Our platform works on what people give feedback to each other. You see that other persons feedback only if you give your feedback"
                : "Collaboration has ended! However you can continue to chat with the brand for any future opportunities."}
        </Text>
      </View>
    </View>
  );
};

export default ActionContainer;
