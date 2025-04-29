import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { INotifications } from "@/shared-libs/firestore/trendly-pro/models/notifications";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { Notification, PushNotificationPayload } from "@/types/Notification";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthContext } from "./auth-context.provider";
;
;
;

interface NotificationContextProps {
  createNotification: (
    userId: string,
    notification: INotifications,
    userType?: string,
  ) => Promise<void>;
  markAllNotificationsAsRead: (userId: string) => Promise<void>;
  sendNotification: (
    ids: {
      users?: string[];
      managers?: string[];
    },
    payload: PushNotificationPayload,
  ) => Promise<void>;
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

  const sendNotification = async (
    ids: {
      users?: string[];
      managers?: string[];
    },
    payload: PushNotificationPayload,
  ) => {
    await HttpWrapper.fetch("/api/v1/chat/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: ids.users || [],
        managerId: ids.managers || [],
        payload,
      }),
    });
  }

  const createNotification = async (
    userId: string,
    notification: INotifications,
    userType: string = "managers",
  ) => {
    const userRef = doc(FirestoreDB, userType, userId);
    const notificationsRef = collection(userRef, "notifications");
    await addDoc(notificationsRef, {
      data: notification.data,
      description: notification.description,
      isRead: notification.isRead,
      timeStamp: notification.timeStamp,
      title: notification.title,
      type: notification.type,
    });
  }

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
        createNotification,
        markAllNotificationsAsRead,
        sendNotification,
        unreadNotifications,
        updateUserNotification,
        userNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
