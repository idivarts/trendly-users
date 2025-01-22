import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import ChipCard from "./ChipComponent";
import {
  faCoins,
  faDollarSign,
  faFilm,
  faHouseLaptop,
  faLocationDot,
  faMap,
  faPanorama,
  faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { faHeart, faStarHalfStroke } from "@fortawesome/free-regular-svg-icons";

interface CollaborationDetailsProps {
  collaborationDetails: {
    collabDescription: string;
    promotionType: string;
    location: any;
    platform: string[];
    contentType: string[];
  };
}

const CollaborationDetails: FC<CollaborationDetailsProps> = ({
  collaborationDetails: {
    collabDescription,
    promotionType,
    location,
    platform,
    contentType,
  },
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 16,
      }}
    >
      {collabDescription && (
        <Text
          style={{
            color: Colors(theme).gray100,
            fontSize: 16,
          }}
        >
          {collabDescription}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          flexWrap: "wrap",
          rowGap: 10,
        }}
      >
        <ChipCard
          chipText={
            promotionType === PromotionType.PAID_COLLAB ? "Paid" : "Unpaid"
          }
          chipIcon={faDollarSign}
        />
        <ChipCard
          chipText={location.type}
          chipIcon={location.type === "On-Site" ? faLocationDot : faHouseLaptop}
        />
        {platform &&
          platform.map((content, index) => (
            <ChipCard
              key={index}
              chipText={content}
              chipIcon={
                content === "Instagram"
                  ? faInstagram
                  : content === "Facebook"
                  ? faFacebook
                  : content === "Youtube"
                  ? faYoutube
                  : faInstagram
              }
            />
          ))}
        {contentType &&
          contentType.map((content, index) => (
            <ChipCard
              key={index}
              chipText={content}
              chipIcon={
                content === "Posts"
                  ? faPanorama
                  : content === "Reels"
                  ? faFilm
                  : content === "Stories"
                  ? faHeart
                  : content === "Live"
                  ? faRecordVinyl
                  : content === "Product Reviews"
                  ? faStarHalfStroke
                  : faPanorama
              }
            />
          ))}
      </View>
    </View>
  );
};

export default CollaborationDetails;
