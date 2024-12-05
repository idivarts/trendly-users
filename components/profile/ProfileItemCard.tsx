import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/profile/ProfileItemCard.styles";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "@/contexts";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";

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
                  backgroundColor: "#E8B931",
                  width: 20,
                  height: 20,
                  borderRadius: 40,
                }}
              ></View>
            )}
        </View>
        <FontAwesomeIcon
          color={theme.dark ? Colors(theme).text : Colors(theme).primary}
          icon={faChevronRight}
          size={14}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

export default ProfileItemCard;
