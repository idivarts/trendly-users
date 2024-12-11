import { Pressable } from "react-native";
import Preferences from "@/components/basic-profile/preferences";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { useState } from "react";

const PreferencesScreen = () => {
  const {
    user,
  } = useAuthContext();

  if (!user) {
    return null;
  }

  const [updatedUser, setUpdatedUser] = useState(user);

  const handleOnSave = (user: any) => {
    setUpdatedUser(user);
  }

  const handleSave = () => {
    console.log('User', updatedUser);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Preferences"
        rightAction
        rightActionButton={
          <Pressable
            onPress={handleSave}
            style={{ padding: 10 }}
          >
            <Text>Save</Text>
          </Pressable>
        }
      />
      <Preferences
        user={user}
        onSave={handleOnSave}
      />
    </View>
  );
};

export default PreferencesScreen;
