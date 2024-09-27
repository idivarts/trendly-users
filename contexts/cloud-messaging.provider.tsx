import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
} from "react";
import messaging from "@react-native-firebase/messaging";
import { Alert, Platform } from "react-native";

import { PermissionsAndroid } from 'react-native';

if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

interface CloudMessagingContextProps { }

const CloudMessagingContext = createContext<CloudMessagingContextProps>(null!);

export const useCloudMessagingContext = () => useContext(CloudMessagingContext);

export const CloudMessagingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("FCM Native Token:", token);
    return token;
  }

  const initNotification = async () => {
    await requestUserPermission();
    await getToken();

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open from quit state:", remoteMessage);
        }
      });
  }

  useEffect(() => {
    initNotification();

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification caused app to open from background state:", remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background:", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <CloudMessagingContext.Provider
      value={null!}
    >
      {children}
    </CloudMessagingContext.Provider>
  );
};