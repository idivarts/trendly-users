import AppLayout from "@/layouts/app-layout";
import React from "react";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import Notifications from "@/components/notifications";
import { useAuthContext, useNotificationContext } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Pressable } from "react-native";

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
      <Notifications
        notifications={userNotifications}
        onMarkAsRead={onMarkAsRead}
      />
    </AppLayout>
  );
}
