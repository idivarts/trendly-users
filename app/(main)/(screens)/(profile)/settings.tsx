import Settings from "@/components/settings";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Settings"
      />
      <Settings />
    </View>
  );
};

export default SettingsScreen;
