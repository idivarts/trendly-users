import Settings from "@/components/settings";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { resetAndNavigate } from "@/utils/router";
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
    await HttpWrapper.fetch("/api/v1/users/deactivate", { method: "DELETE" }).then(r => {
      Toaster.success('Account deactivated successfully');
      logout().catch(e => {
        resetAndNavigate("/pre-signin")
      })
    }).catch(() => {
      Toaster.error('Error Deactivating account');
    }).finally(() => {
      setIsDeactivating(false)
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    await HttpWrapper.fetch("/api/v1/users/delete", { method: "DELETE" }).then(r => {
      Toaster.success('Account deleted successfully');
      logout().catch(e => {
        resetAndNavigate("/pre-signin")
      })
    }).catch(() => {
      Toaster.error('Error Deleting account');
    }).finally(() => {
      setIsDeleting(false)
    })

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
