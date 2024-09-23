import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/profile/ProfileItemCard.styles";
import { useTheme } from "@react-navigation/native";

interface ProfileItemCardProps {
  item: any;
  onPress: () => void;
}

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({
  item,
  onPress,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Avatar.Icon
          icon={item.icon}
          size={36}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {item.title}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          color={Colors(theme).primary}
        />
      </View>
    </Pressable>
  );
};

export default ProfileItemCard;
