import BasicProfile from "@/components/basic-profile";
import { View } from "@/components/theme/Themed";
import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import appHeaderStyles from "@/styles/AppHeader.styles";
import { Appbar } from "react-native-paper";

const BasicProfileScreen = () => {
  const { xl } = useBreakpoints();
  const {
    user,
  } = useAuthContext();

  if (!user) {
    return null;
  }

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
          <BackButton color={Colors.regular.platinum} />
        </View>
        <Appbar.Content
          title="Profile"
          style={appHeaderStyles.appbarContent}
          titleStyle={appHeaderStyles.appbarTitle}
        />
      </Appbar.Header>
      <BasicProfile
        user={user}
      />
    </View>
  );
};

export default BasicProfileScreen;
