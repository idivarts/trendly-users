import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { useAuthContext } from "@/contexts";
import Colors from "@/shared-uis/constants/Colors";
import stylesFn from "@/styles/profile/ProfileItemCard.styles";
import {
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";

interface ProfileItemCardProps {
  item: any;
  onPress: () => void;
}

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const { user } = useAuthContext();

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <FontAwesomeIcon
          color={theme.dark ? Colors(theme).text : Colors(theme).primary}
          icon={item.icon}
          size={22}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          {item.active &&
            (!user?.profile?.completionPercentage ||
              user.profile.completionPercentage < COMPLETION_PERCENTAGE) && (
              <View
                style={{
                  backgroundColor: Colors(theme).yellow,
                  width: 10,
                  height: 10,
                  borderRadius: 20,
                }}
              />
            )}
        </View>
        <FontAwesomeIcon
          color={theme.dark ? Colors(theme).text : Colors(theme).primary}
          icon={faCaretRight}
          size={14}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

export default ProfileItemCard;
