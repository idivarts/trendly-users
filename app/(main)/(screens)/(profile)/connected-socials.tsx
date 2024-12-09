import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import ConnnectedSocials from "@/components/basic-profile/connected-socials";

const ConnnectedSocialsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Connected Socials"
      />
      <ConnnectedSocials />
    </View>
  );
};

export default ConnnectedSocialsScreen;
