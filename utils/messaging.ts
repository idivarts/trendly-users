import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { FirebaseApp } from "./firebase";
import * as Notifications from "expo-notifications";

const messaging = getMessaging(FirebaseApp);

export const requestUserPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === "granted") {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.EXPO_PUBLIC_CLOUD_MESSAGING_VALID_KEY!,
      });
      if (fcmToken) {
        return fcmToken;
      } else {
        console.error("No FCM token received");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.error("Notification permission denied");
  }
  return null;
};

export const setupForegroundMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received while in the foreground: ", payload);
  });
};
