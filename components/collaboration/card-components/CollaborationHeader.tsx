import { Text, View } from "@/components/theme/Themed";
import { FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "react-native-paper";
import { Image, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";

interface CollaborationHeaderProps {
  collabName: string;
  brandName: string;
  brandImage: string;
  collabId: string;
  timePosted?: number;
  paymentVerified: boolean;
  onOpenBottomSheet: (id: string) => void;
}

const CollaborationHeader: FC<CollaborationHeaderProps> = ({
  collabName,
  brandName,
  collabId,
  brandImage,
  timePosted,
  paymentVerified,
  onOpenBottomSheet,
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
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
          source={{ uri: brandImage }}
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
            {collabName}
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {brandName}
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
        {timePosted ? (
          <Text
            style={{
              fontSize: 12,
              color: Colors(theme).text,
              paddingRight: 8,
            }}
          >
            {formatDistanceToNow(timePosted, {
              addSuffix: true,
            })}
          </Text>
        ) : null}
        <Pressable
          onPress={() => {
            onOpenBottomSheet(collabId);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsisH}
            size={24}
            color={Colors(theme).text}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default CollaborationHeader;
