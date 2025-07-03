import { Text, View } from "@/components/theme/Themed";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import { formatTimeToNow } from "@/utils/date";
import { imageUrl } from "@/utils/url";
import { faCheckCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { Pressable } from "react-native";

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
  const router = useMyNavigation()

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
          },
        });
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors(theme).background,
        justifyContent: "space-between",
        padding: 8,
        paddingTop: 16,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingRight: 16,
          flex: 1,
        }}
      >
        <ImageComponent
          url={imageUrl(brand.image)}
          altText="brand logo"
          shape="square"
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
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {collaboration.collabName}
          </Text>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {brand.name}{" "}
            {brand.paymentVerified && (
              <FontAwesomeIcon
                icon={faCheckCircle}
                color={Colors(theme).primary}
                size={12}
              />
            )}
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
              fontSize: 10,
              color: Colors(theme).text,
              paddingRight: 8,
            }}
          >
            {formatTimeToNow(collaboration.timePosted)}
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
