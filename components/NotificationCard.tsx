import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { stylesFn } from "@/styles/NotificationCard.styles";
import { useTheme } from "@react-navigation/native";

interface NotificationCardProps {
  action: string;
  avatar: string;
  brand: string;
  description: string;
  group: string;
  isRead: boolean;
  onMarkAsRead: () => void;
  time: number;
  title: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  action,
  avatar,
  brand,
  description,
  group,
  isRead,
  onMarkAsRead,
  time,
  title,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar.Image size={50} source={{ uri: avatar }} />
        <View style={styles.content}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.time}>
            {description}
          </Text>
          <Text style={styles.time}>
            {
              new Date(time).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )
            }
            {", "}
            {
              new Date(time).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )
            }
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {action && (
          <Button mode="contained" onPress={() => { }}>
            Open
          </Button>
        )}
        {!isRead && (
          <Button
            mode="outlined"
            onPress={onMarkAsRead}
            style={styles.markAsReadButton}
          >
            Mark as Read
          </Button>
        )}
      </View>
    </Card>
  );
};
