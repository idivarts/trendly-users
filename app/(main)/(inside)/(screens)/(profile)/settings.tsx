import Settings from "@/components/settings";
import { View } from "@/components/theme/Themed";
import { useAuthContext, useCloudMessagingContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const SettingsScreen = () => {
    const {
        user,
        updateUser,
        signOutUser: logout,
    } = useAuthContext();
    const { updatedTokens } = useCloudMessagingContext();
    const { resetAndNavigate } = useMyNavigation()

    if (!user) {
        return null;
    }

    const [updatedUser, setUpdatedUser] = useState(user);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleOnSave = (user: User) => {
        setUpdatedUser(user);
    }

    // Auto-save theme changes immediately
    useEffect(() => {
        if (updatedUser.settings?.theme !== user?.settings?.theme) {
            saveThemeChange();
        }
    }, [updatedUser.settings?.theme]);

    const saveThemeChange = async () => {
        setIsSaving(true);
        try {
            await updateUser(updatedUser.id, {
                settings: {
                    ...updatedUser.settings,
                    theme: updatedUser.settings?.theme,
                }
            });
            Toaster.success('Theme updated');
        } catch (error) {
            Toaster.error('Error updating theme');
            // Revert on error
            setUpdatedUser(user);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDeactivate = async () => {
        setIsDeactivating(true);
        await HttpWrapper.fetch("/api/v2/users/deactivate", { method: "DELETE" }).then(async r => {
            Toaster.success('Account deactivated successfully');
            await updatedTokens?.();
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
        await HttpWrapper.fetch("/api/v2/users/delete", { method: "DELETE" }).then(async r => {
            Toaster.success('Account deleted successfully');
            await updatedTokens?.();
            logout().catch(e => {
                resetAndNavigate("/pre-signin")
            })
        }).catch(() => {
            Toaster.error('Error Deleting account');
        }).finally(() => {
            setIsDeleting(false)
        })

    }

    return (
        <AppLayout withWebPadding>
            <View style={{ flex: 1 }}>
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
