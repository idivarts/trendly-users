import { Pressable } from "react-native";
import Preferences from "@/components/basic-profile/preferences";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { useState } from "react";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import Toast from "react-native-toast-message";

const PreferencesScreen = () => {
  const {
    user,
    updateUser,
  } = useAuthContext();

  if (!user) {
    return null;
  }

  const [updatedUser, setUpdatedUser] = useState(user);

  const handleOnSave = (user: User) => {
    setUpdatedUser(user);
  }

  const handleSave = async () => {
    await updateUser(updatedUser.id, updatedUser).then(() => {
      Toaster.success('Saved changes successfully');
    }).catch((error) => {
      Toaster.error('Error saving preferences');
    });
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
      <Toast />
    </View>
  );
};

export default PreferencesScreen;
