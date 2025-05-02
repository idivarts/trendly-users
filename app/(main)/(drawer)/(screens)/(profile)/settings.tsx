import Settings from "@/components/settings";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { AccountStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { useState } from "react";
import { Pressable } from "react-native";
import Toast from "react-native-toast-message";

const SettingsScreen = () => {
  const {
    deleteUserAccount,
    user,
    updateUser,
    signOutUser: logout,
  } = useAuthContext();

  if (!user) {
    return null;
  }

  const [updatedUser, setUpdatedUser] = useState(user);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnSave = (user: User) => {
    setUpdatedUser(user);
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    const updatedUser = {
      ...user,
      settings: {
        accountStatus: AccountStatus.Deactivated,
      }
    };

    await updateUser(updatedUser.id, updatedUser).then(() => {
      setIsDeactivating(false);
      Toaster.success('Account deactivated successfully');

      logout();
    });
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteUserAccount(user.id).then(() => {
      setIsDeleting(false);
      Toaster.success('Account deleted successfully');

      logout();
    });
  }

  const handleSave = async () => {
    await updateUser(updatedUser.id, updatedUser).then(() => {
      Toaster.success('Saved changes successfully');
    }).catch((error) => {
      Toaster.error('Error saving preferences');
    });
  }

  return (
    <AppLayout withWebPadding>
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
          isDeactivating={isDeactivating}
          isDeleting={isDeleting}
        />
        <Toast />
      </View>
    </AppLayout>
  );
};

export default SettingsScreen;
