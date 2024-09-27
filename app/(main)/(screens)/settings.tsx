import Settings from "@/components/settings";
import { View } from "@/components/theme/Themed";
import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import appHeaderStylesFn from "@/styles/AppHeader.styles";
import { useTheme } from "@react-navigation/native";
import { Appbar } from "react-native-paper";

const SettingsScreen = () => {
  const { xl } = useBreakpoints();
  const theme = useTheme();
  const appHeaderStyles = appHeaderStylesFn(theme);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={0}
        style={appHeaderStyles.appbarHeader}
      >
        <View
          style={[
            appHeaderStyles.backButtonContainer,
            {
              marginLeft: xl ? 10 : 0,
            },
          ]}
        >
          <BackButton color={Colors(theme).platinum} />
        </View>
        <Appbar.Content
          title="Settings"
          style={appHeaderStyles.appbarContent}
          titleStyle={appHeaderStyles.appbarTitle}
        />
      </Appbar.Header>
      <Settings />
    </View>
  );
};

export default SettingsScreen;
