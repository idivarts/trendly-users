import Colors from "@/shared-uis/constants/Colors";
import { Notification } from "@/types/Notification";
import { Theme, useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { NotificationCard } from "../NotificationCard";
import { View } from "../theme/Themed";
import EmptyState from "../ui/empty-state";



interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  // NotficationTypesToHandle

  return (
    <>
      {
        notifications.length === 0 ? (
          <View style={styles.container}>
            <EmptyState
              hideAction
              image={require("@/assets/images/illustration2.png")}
              subtitle="We have no notifications for you today!"
              title="You are all caught up! "
            />
          </View>
        ) : (
          <FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationCard
                // avatar="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
                data={{
                  collaborationId: item.data?.collaborationId,
                  groupId: item.data?.groupId,
                  userId: item.data?.userId,
                }}
                description={item.description}
                isRead={item.isRead}
                onMarkAsRead={() => onMarkAsRead(item.id)}
                time={item.timeStamp}
                title={item.title}
              />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )
      }
    </>
  );
};

export default Notifications;

export const stylesFn = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors(theme).background,
  },
  contentContainer: {
    gap: 16,
    paddingBottom: 24,
  },
});