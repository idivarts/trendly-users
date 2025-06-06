import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import Colors from "@/shared-uis/constants/Colors";
import { resetAndNavigate } from "@/utils/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Platform, Pressable } from "react-native";
import { Appbar } from "react-native-paper";

interface ScreenHeaderProps {
  action?: () => void;
  title: string;
  rightActionButton?: React.ReactNode;
  rightAction?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  action,
  title,
  rightActionButton,
  rightAction = false,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuthContext();

  const handleAction = () => {
    if (action) {
      action();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else if ((user?.profile?.completionPercentage || 0) < 60) {
      resetAndNavigate("/profile");
    } else {
      resetAndNavigate("/collaborations");
    }
  };

  return (
    <Appbar.Header
      style={{
        backgroundColor: Colors(theme).background,
        elevation: 0,
      }}
      statusBarHeight={0}
    >
      <Pressable onPress={handleAction}>
        <View
          style={{
            marginTop: 2,
            marginLeft: 16,
          }}
          lightColor={Colors(theme).transparent}
          darkColor={Colors(theme).transparent}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            color={Colors(theme).text}
            style={{
              alignItems: "center",
            }}
          />
        </View>
      </Pressable>

      <Appbar.Content
        style={{
          flex: 1,
          marginLeft: Platform.OS === "web" ? 32 : 16,
        }}
        color={Colors(theme).text}
        title={title}
      />

      {rightAction && <Text style={{ fontSize: 16, fontWeight: "400" }}><View>{rightActionButton}</View></Text>}
    </Appbar.Header>
  );
};

export default ScreenHeader;
