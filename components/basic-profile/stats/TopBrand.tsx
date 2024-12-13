import React from "react";
import { Avatar, Card } from "react-native-paper";
import { Text, View } from "@/components/theme/Themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

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
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} size={16} color="gold" />
        ))}
        {hasHalfStar && (
          <FontAwesomeIcon icon={faStarHalfStroke} size={16} color="gold" />
        )}
      </>
    );
  };

  return (
    <Card style={{ margin: 2, padding: 15, borderRadius: 10, elevation: 4 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Avatar.Icon
          size={50}
          icon="account"
          style={{ backgroundColor: "#f0f0f0" }}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {name}
          </Text>
          <Text style={{ color: "#777" }}>
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
