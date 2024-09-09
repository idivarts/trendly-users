import AppLayout from "@/layouts/app-layout";
import { NotificationCard } from "@/components/NotificationCard";
import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { createStyles } from "@/styles/NotificationCard.styles";
import { notifications } from "@/constants/Notification";
import { useTheme } from "@react-navigation/native";

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  return (
    <AppLayout>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
          elevation: 0,
        }}
        statusBarHeight={0}
      >
        <Appbar.Action
          icon="arrow-left"
          color={colors.text}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Appbar.Content title="Notifications" color={colors.text} />

        <Appbar.Action icon="check" onPress={() => {}} color={colors.text} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        {notifications.length === 0 && (
          <Text style={{ textAlign: "center" }}>No notifications</Text>
        )}
        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            adName={item.adName}
            userName={item.userName}
            brandName={item.brandName}
            notification={item.notification}
            avatar={item.avatar}
            time={item.time}
            action={item.action}
          />
        ))}
      </ScrollView>
    </AppLayout>
  );
}
