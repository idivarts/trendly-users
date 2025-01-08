import AppLayout from "@/layouts/app-layout";
import React from "react";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import Notifications from "@/components/notifications";
import { useAuthContext, useNotificationContext } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Pressable } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";
import { Appbar } from "react-native-paper";

export const NotificationAction = () => {
  const theme = useTheme();

  const {
    user,
  } = useAuthContext();
  const {
    markAllNotificationsAsRead,
  } = useNotificationContext();

  return (
    <Pressable
      onPress={() => {
        markAllNotificationsAsRead(user?.id as string);
      }}
      style={{
        paddingRight: 16,
      }}
    >
      <FontAwesomeIcon
        icon={faCheck}
        size={20}
        color={Colors(theme).text}
      />
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const {
    user,
  } = useAuthContext();
  const {
    userNotifications,
    updateUserNotification,
    markAllNotificationsAsRead,
  } = useNotificationContext();

  const theme = useTheme();

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
                color={Colors(theme).text}
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
