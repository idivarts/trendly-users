import { useNotificationContext } from "@/contexts";
import Colors from "@/shared-uis/constants/Colors";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Badge } from "react-native-paper";
import { View } from "../theme/Themed";

const NotificationIcon: React.FC = () => {
  const theme = useTheme();

  const {
    unreadNotifications,
  } = useNotificationContext();

  return (
    <Link href="/notifications" asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            style={{
              position: "relative",
              marginRight: 15,
            }}
          >
            <Badge
              visible={unreadNotifications !== 0}
              size={20}
              selectionColor={Colors(theme).red}
              style={{
                backgroundColor: Colors(theme).red,
                zIndex: 1,
                position: "absolute",
                top: -7,
                right: -8,
              }}
            >
              {unreadNotifications}
            </Badge>
            <FontAwesomeIcon
              icon={faBell}
              size={25}
              color={Colors(theme).text}
              style={{
                zIndex: 0,
                opacity: pressed ? 0.5 : 1,
              }}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
};

export default NotificationIcon;
