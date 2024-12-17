import Settings from "@/components/settings";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { AccountStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { useState } from "react";
import { Pressable } from "react-native";

const SettingsScreen = () => {
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

  const handleDeactivate = async () => {
    const updatedUser = {
      ...user,
      settings: {
        accountStatus: AccountStatus.Deactivated,
      }
    };

    await updateUser(updatedUser.id, updatedUser);
  }

  const handleDelete = async () => {
    const updatedUser = {
      ...user,
      settings: {
        accountStatus: AccountStatus.Deleted,
      }
    };

    await updateUser(updatedUser.id, updatedUser);
  }

  const handleSave = async () => {
    await updateUser(updatedUser.id, updatedUser).then(() => {
      Toaster.success('Preferences saved');
    }).catch((error) => {
      Toaster.error('Error saving preferences');
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Settings"
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
      <Settings
        handleDeactivate={handleDeactivate}
        handleDelete={handleDelete}
        onSave={handleOnSave}
        user={user}
      />
    </View>
  );
};

export default SettingsScreen;
