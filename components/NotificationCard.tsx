import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { stylesFn } from "@/styles/NotificationCard.styles";
import { useTheme } from "@react-navigation/native";

export const NotificationCard = ({
  adName,
  userName,
  brandName,
  notification,
  avatar,
  time,
  action,
}: {
  adName: string;
  userName: string;
  brandName: string;
  notification: string;
  avatar: string;
  time: string;
  action: { open: boolean; markAsRead: boolean };
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar.Image size={50} source={{ uri: avatar }} />
        <View style={styles.content}>
          <Text style={styles.adName}>{adName}</Text>
          <Text style={styles.time}>{notification}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {action.open && (
          <Button mode="contained" onPress={() => { }}>
            Open
          </Button>
        )}
        {action.markAsRead && (
          <Button
            mode="outlined"
            onPress={() => { }}
            style={styles.markAsReadButton}
          >
            Mark as Read
          </Button>
        )}
      </View>
    </Card>
  );
};
