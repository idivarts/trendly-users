import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/profile/ProfileItemCard.styles";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon
          color={Colors(theme).text}
          icon={item.icon}
          size={26}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {item.title}
          </Text>
        </View>
        <FontAwesomeIcon
          icon={faChevronRight}
          size={14}
          color={Colors(theme).text}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

export default ProfileItemCard;
