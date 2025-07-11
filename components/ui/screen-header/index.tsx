import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
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
  const { user } = useAuthContext();
  const router = useMyNavigation()

  const handleAction = () => {
    if (action) {
      action();
    } else if (router.canGoBack()) {
      router.back()
    } else if ((user?.profile?.completionPercentage || 0) < 60) {
      router.resetAndNavigate("/profile");
    } else {
      router.resetAndNavigate("/collaborations");
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
