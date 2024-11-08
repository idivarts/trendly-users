import AppLayout from "@/layouts/app-layout";
import { useNavigation } from "expo-router";
import React from "react";
import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import Notifications from "@/components/notifications";
import { useAuthContext, useNotificationContext } from "@/contexts";

export default function NotificationsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

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
      <Appbar.Header
        style={{
          backgroundColor: Colors(theme).background,
          elevation: 0,
        }}
        statusBarHeight={0}
      >
        <Appbar.Action
          icon="arrow-left"
          color={Colors(theme).text}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Appbar.Content
          title="Notifications"
          color={Colors(theme).text}
        />

        <Appbar.Action
          icon="check"
          onPress={() => {
            markAllNotificationsAsRead(user?.id as string);
          }}
          color={Colors(theme).text}
        />
      </Appbar.Header>
      <Notifications
        notifications={userNotifications}
        onMarkAsRead={onMarkAsRead}
      />
    </AppLayout>
  );
}
