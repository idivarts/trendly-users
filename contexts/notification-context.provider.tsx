import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { Notification } from "@/types/Notification";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
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

export const NotficationTypesToHandle = ["revise-quotation", "application", "contract-started", "contract-ended", "invitation"]

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [userNotifications, setUserNotifications] = useState<(Notification)[]>([]);

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
    if (user && user.id) {
      const unsubscribe = fetchUserNotifications(user.id);
      return () => {
        unsubscribe()
      }
    }
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
      Console.error(error, "Error updating notifications: ");
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        markAllNotificationsAsRead,
        unreadNotifications,
        updateUserNotification,
        userNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
