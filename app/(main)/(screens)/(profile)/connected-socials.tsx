import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import ConnnectedSocials from "@/components/basic-profile/connected-socials";
import AppLayout from "@/layouts/app-layout";

const ConnnectedSocialsScreen = () => {
  return (
    <AppLayout style={{ flex: 1 }}>
      <ScreenHeader title="Connected Socials" />
      <ConnnectedSocials />
    </AppLayout>
  );
};

export default ConnnectedSocialsScreen;
