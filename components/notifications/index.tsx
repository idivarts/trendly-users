import { stylesFn } from "@/styles/NotificationCard.styles";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { Text } from "../theme/Themed";
import { NotificationCard } from "../NotificationCard";
import { Notification } from "@/types/Notification";

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
    <ScrollView style={styles.container}>
      {notifications.length === 0 && (
        <Text
          style={{
            textAlign: "center",
          }}
        >
          No notifications
        </Text>
      )}
      {notifications.map((item) => (
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
      ))}
    </ScrollView>
  );
};

export default Notifications;
