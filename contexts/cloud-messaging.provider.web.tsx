import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
} from "react";

import { Platform } from "react-native";
import { useAuthContext } from "./auth-context.provider";

interface CloudMessagingContextProps { }

const CloudMessagingContext = createContext<CloudMessagingContextProps>(null!);

export const useCloudMessagingContext = () => useContext(CloudMessagingContext);

export const CloudMessagingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    session,
    user,
    updateUser,
  } = useAuthContext();

  const requestPermission = async () => {
    // const permission = await Notification.requestPermission();
    // if (permission === "granted") {
    //   const token = await getToken(
    //     messaging,
    //     {
    //       vapidKey: process.env.EXPO_PUBLIC_CLOUD_MESSAGING_VALID_KEY,
    //     },
    //   );

    //   if (user && session) {
    //     const newNativeToken = newToken("web", user, token);

    //     if (newNativeToken) {
    //       await updateUser(session, {
    //         pushNotificationToken: newNativeToken,
    //       });
    //     }
    //   }
    // } else if (permission === "denied") {
    //   alert("You denied the permission to receive notifications");
    // }
  }

  useEffect(() => {
    try {
      if (Platform.OS === "web" && session && user) {
        requestPermission();
      }
    } catch (e) {
      console.log(e);
    }
  }, [session, user]);

  return (
    <CloudMessagingContext.Provider
      value={null!}
    >
      {children}
    </CloudMessagingContext.Provider>
  );
};
