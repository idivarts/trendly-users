import { View, Text } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { Avatar } from "react-native-paper";

interface MembersCardProps {
  manager: any;
}

const MembersCard: FC<MembersCardProps> = ({ manager }) => {
  const theme = useTheme();

  if (!manager) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderWidth: 0.3,
        borderColor: Colors(theme).gray300,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar.Image size={40} source={imageUrl(manager.profileImage)} />
        <View>
          <View>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {manager.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {manager.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MembersCard;
