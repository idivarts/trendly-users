import { stylesFn } from "@/styles/NotificationCard.styles";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { NotificationCard } from "../NotificationCard";
import { Notification } from "@/types/Notification";
import EmptyState from "../ui/empty-state";
import { View } from "../theme/Themed";

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
          <ScrollView style={styles.container}>
            {
              notifications.map((item) => (
                <NotificationCard
                  avatar="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
                  collaborationId={item.data?.collaborationId || ""}
                  description={item.description}
                  groupId={item.data?.groupId || ""}
                  isRead={item.isRead}
                  key={item.id}
                  onMarkAsRead={() => onMarkAsRead(item.id)}
                  time={item.timeStamp}
                  title={item.title}
                />
              ))
            }
          </ScrollView>
        )
      }
    </>
  );
};

export default Notifications;
