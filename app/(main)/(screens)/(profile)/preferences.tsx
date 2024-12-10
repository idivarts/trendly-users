import { Pressable } from "react-native";
import Preferences from "@/components/basic-profile/preferences";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";

const PreferencesScreen = () => {
  const {
    user,
  } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Preferences"
        rightAction
        rightActionButton={
          <Pressable
            onPress={() => {
              console.log('Saved');
            }}
            style={{ padding: 10 }}
          >
            <Text>Save</Text>
          </Pressable>
        }
      />
      <Preferences />
    </View>
  );
};

export default PreferencesScreen;
