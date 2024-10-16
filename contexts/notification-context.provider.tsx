import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";

import { collection, query, doc, orderBy, updateDoc, onSnapshot } from "firebase/firestore";
import { Notification } from "@/types/Notification";
import { FirestoreDB } from "@/utils/firestore";
import { useAuthContext } from "./auth-context.provider";

interface NotificationContextProps {
  userNotifications: Notification[];
  unreadNotifications: number;
  updateUserNotification: (
    userId: string,
    notificationId: string,
    data: Partial<Notification>,
  ) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>(null!);

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);

  const {
    user,
  } = useAuthContext();

  const fetchUserNotifications = (
    userId: string
  ) => {
    const userRef = doc(FirestoreDB, "users", userId);

    const notificationsRef = collection(userRef, "notifications");
    const notificationsQuery = query(notificationsRef, orderBy("timeStamp", "desc"));
    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((doc) => {
        notifications.push({
          ...doc.data() as Notification,
          id: doc.id,
        });
      });

      const unreadNotifications = notifications.filter((notification) => !notification.isRead);

      setUnreadNotifications(unreadNotifications.length);

      setUserNotifications(notifications);
    });
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user && user.id) {
      unsubscribe = fetchUserNotifications(user.id);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const updateUserNotification = async (
    userId: string,
    notificationId: string,
    data: Partial<Notification>,
  ) => {
    const userRef = doc(FirestoreDB, "users", userId);
    const notificationRef = doc(userRef, "notifications", notificationId);

    await updateDoc(notificationRef, data);
  }

  return (
    <NotificationContext.Provider
      value={{
        userNotifications,
        unreadNotifications,
        updateUserNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
