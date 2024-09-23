import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import { Avatar } from "react-native-paper";
import stylesFn from "@/styles/profile/ProfileCard.styles";
import { User } from "@/types/User";
import { PLACEHOLDER_PERSON_IMAGE } from "@/constants/Placeholder";
import { useTheme } from "@react-navigation/native";

interface ProfileCardProps {
  item: User;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  item,
  onPress,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Avatar.Image
          source={{
            uri: item.profileImage || PLACEHOLDER_PERSON_IMAGE,
          }}
          size={56}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {item.name}
          </Text>
          <Text
            style={{
              opacity: 0.8,
            }}
          >
            {item.email}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProfileCard;
