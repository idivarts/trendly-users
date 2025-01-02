import { Text, View } from "@/components/theme/Themed";
import { FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "react-native-paper";
import { Image, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { imageUrl } from "@/utils/url";

interface CollaborationHeaderProps {
  cardType: string;
  cardId: string;
  brand: {
    name: string;
    image: string;
    paymentVerified: boolean;
  };
  collaboration: {
    collabName: string;
    collabId: string;
    timePosted?: number;
  };

  onOpenBottomSheet: (id: string) => void;
}

const CollaborationHeader: FC<CollaborationHeaderProps> = ({
  brand,
  cardId,
  cardType,
  collaboration,

  onOpenBottomSheet,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        router.push({
          // @ts-ignore
          pathname:
            cardType === "contract"
              ? `/contract-details/${cardId}`
              : `/collaboration-details/${collaboration.collabId}`,
          params: {
            cardType: cardType,
            cardId: cardId,
            collaborationID: collaboration.collabId,
          },
        });
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors(theme).background,
        padding: 16,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexGrow: 1,
        }}
      >
        <Image
          source={imageUrl(brand.image)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 5,
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              width: 200,
            }}
          >
            {collaboration.collabName}
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {brand.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {collaboration.timePosted ? (
          <Text
            style={{
              fontSize: 12,
              color: Colors(theme).text,
              paddingRight: 8,
            }}
          >
            {formatDistanceToNow(collaboration.timePosted, {
              addSuffix: true,
            })}
          </Text>
        ) : null}
        <Pressable
          onPress={() => {
            onOpenBottomSheet(collaboration.collabId);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsisH}
            size={24}
            color={Colors(theme).text}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default CollaborationHeader;
