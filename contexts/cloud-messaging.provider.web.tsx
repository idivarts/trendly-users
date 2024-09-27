import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
} from "react";

import { getToken } from "firebase/messaging";
import { messaging } from "@/utils/messaging-web";

interface CloudMessagingContextProps { }

const CloudMessagingContext = createContext<CloudMessagingContextProps>(null!);

export const useCloudMessagingContext = () => useContext(CloudMessagingContext);

export const CloudMessagingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(
        messaging,
        {
          vapidKey: process.env.EXPO_PUBLIC_CLOUD_MESSAGING_VALID_KEY,
        },
      );

      console.log("FCM Web Token: ", token);
    } else if (permission === "denied") {
      alert("You denied the permission to receive notifications");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <CloudMessagingContext.Provider
      value={null!}
    >
      {children}
    </CloudMessagingContext.Provider>
  );
};
