import { View } from "@/components/theme/Themed";
import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import appHeaderStyles from "@/styles/AppHeader.styles";
import { Appbar } from "react-native-paper";

const ConnnectedSocials = () => {
  const { xl } = useBreakpoints();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header statusBarHeight={0} style={appHeaderStyles.appbarHeader}>
        <View style={[appHeaderStyles.backButtonContainer, { marginLeft: xl ? 10 : 0 }]}>
          <BackButton color={Colors.regular.platinum} />
        </View>
        <Appbar.Content
          title="Connected Socials"
          style={appHeaderStyles.appbarContent}
          titleStyle={appHeaderStyles.appbarTitle}
        />
      </Appbar.Header>
    </View>
  );
};

export default ConnnectedSocials;