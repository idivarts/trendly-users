import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import Notifications from "@/components/notifications";
import { useAuthContext, useNotificationContext } from "@/contexts";
import ScreenHeader from "@/components/ui/screen-header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function NotificationsScreen() {
  const theme = useTheme();

  const {
    user,
  } = useAuthContext();
  const {
    markAllNotificationsAsRead,
    userNotifications,
    updateUserNotification,
  } = useNotificationContext();

  const onMarkAsRead = (notificationId: string) => {
    updateUserNotification(
      user?.id as string,
      notificationId,
      {
        isRead: true,
      },
    );
  };

  return (
    <AppLayout>
      <ScreenHeader
        title="Notifications"
        rightAction
        rightActionButton={
          <Appbar.Action
            icon={() => (
              <FontAwesomeIcon
                icon={faCheck}
                size={20}
              />
            )}
            onPress={() => {
              markAllNotificationsAsRead(user?.id as string);
            }}
            color={Colors(theme).text}
          />
        }
      />
      <Notifications
        notifications={userNotifications}
        onMarkAsRead={onMarkAsRead}
      />
    </AppLayout>
  );
}
