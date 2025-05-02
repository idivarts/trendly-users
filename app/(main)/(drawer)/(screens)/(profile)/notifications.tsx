import Notifications from "@/components/notifications";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { useAuthContext, useNotificationContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
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
    <AppLayout withWebPadding>
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
