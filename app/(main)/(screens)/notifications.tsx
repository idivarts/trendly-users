import AppLayout from "@/layouts/app-layout";
import { NotificationCard } from "@/components/NotificationCard";
import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { stylesFn } from "@/styles/NotificationCard.styles";
import { notifications } from "@/constants/Notification";
import { useTheme } from "@react-navigation/native";
import Colors from "@/constants/Colors";

export default function NotificationsScreen() {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const navigation = useNavigation();
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

        <Appbar.Content title="Notifications" color={Colors(theme).text} />

        <Appbar.Action icon="check" onPress={() => { }} color={Colors(theme).text} />
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
