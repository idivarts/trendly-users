import { View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import appHeaderStylesFn from "@/styles/AppHeader.styles";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";

const HelpAndSupportScreen = () => {
  const theme = useTheme();
  const appHeaderStyles = appHeaderStylesFn(theme);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={0}
        style={appHeaderStyles.appbarHeader}
      >
        <Appbar.Action
          icon="arrow-left"
          color={Colors(theme).text}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title="Help and Support"
          style={appHeaderStyles.appbarContent}
          titleStyle={appHeaderStyles.appbarTitle}
        />
      </Appbar.Header>
    </View>
  );
};

export default HelpAndSupportScreen;
