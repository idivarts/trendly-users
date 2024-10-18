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
          color={Colors(theme).primary}
          name="chevron-forward"
          size={16}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

export default ProfileItemCard;
