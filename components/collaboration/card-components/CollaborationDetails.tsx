import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { Chip } from "react-native-paper";
import ChipCard from "./ChipComponent";
import { faCoins, faDollar, faMap } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";

interface CollaborationDetailsProps {
  collabDescription: string;
  promotionType: string;
  location: any;
  platform: string[];
  contentType: string[];
}

const CollaborationDetails: FC<CollaborationDetailsProps> = ({
  collabDescription,
  promotionType,
  location,
  platform,
  contentType,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          color: Colors(theme).gray100,
          fontSize: 16,
        }}
      >
        {collabDescription}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        <ChipCard
          chipText={
            promotionType === PromotionType.PAID_COLLAB ? "Paid" : "Unpaid"
          }
          chipIcon={faDollar}
        />
        <ChipCard chipText={location.type} chipIcon={faMap} />
        <ChipCard
          chipText={
            platform.length > 1
              ? platform[0] + "+" + (platform.length - 1)
              : platform[0]
          }
          chipIcon={
            platform[0] === "Instagram"
              ? faInstagram
              : platform[0] === "Facebook"
              ? faFacebook
              : platform[0] === "Youtube"
              ? faYoutube
              : faInstagram
          }
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {contentType &&
          contentType.map((content, index) => (
            <ChipCard key={index} chipText={content} chipIcon={faCoins} />
          ))}
      </View>
    </View>
  );
};

export default CollaborationDetails;
