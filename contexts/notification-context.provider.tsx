import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";

import { collection, query, doc, orderBy, updateDoc, onSnapshot, where, getDocs, writeBatch } from "firebase/firestore";
import { Notification } from "@/types/Notification";
import { FirestoreDB } from "@/utils/firestore";
import { useAuthContext } from "./auth-context.provider";

interface NotificationContextProps {
  markAllNotificationsAsRead: (userId: string) => Promise<void>;
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

  const markAllNotificationsAsRead = async (
    userId: string,
  ) => {
    try {
      const userRef = doc(FirestoreDB, "users", userId);
      const notificationsRef = collection(userRef, "notifications");

      const unreadNotificationsQuery = query(notificationsRef, where("isRead", "==", false));

      const unreadSnapshot = await getDocs(unreadNotificationsQuery);

      if (unreadSnapshot.empty) {
        return;
      }

      const batch = writeBatch(FirestoreDB);

      unreadSnapshot.forEach((notificationDoc) => {
        const notificationRef = notificationDoc.ref;
        batch.update(notificationRef, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      console.error("Error updating notifications: ", error);
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        markAllNotificationsAsRead,
        userNotifications,
        unreadNotifications,
        updateUserNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
