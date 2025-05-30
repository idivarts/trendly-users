import { Text, View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Avatar, Card } from "react-native-paper";

interface TopBrandProps {
  name: string;
  numberOfCompletedCampaigns: number;
  rating: number;
}

export const TopBrandCard: React.FC<TopBrandProps> = ({
  name,
  numberOfCompletedCampaigns,
  rating,
}) => {
  const theme = useTheme();

  const renderStars = () => {
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

  return (
    <Card
      style={{
        margin: 2,
        padding: 15,
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          borderRadius: 10,
          borderWidth: 0.2,
        }}
      >
        <Avatar.Icon
          size={50}
          icon="account"
          style={{ backgroundColor: Colors(theme).gray100 }}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {name}
          </Text>
          <Text style={{ color: Colors(theme).text }}>
            {numberOfCompletedCampaigns} campaigns completed
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {renderStars()}
        </View>
      </View>
    </Card>
  );
};
