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
    limit,
    startAfter,
    updateDoc,
    where,
    writeBatch
} from "firebase/firestore";
import { useAuthContext } from "./auth-context.provider";

interface NotificationContextProps {
    markAllNotificationsAsRead: (userId: string) => Promise<void>;
    userNotifications: Notification[];
    unreadNotifications: number;
    refreshUserNotifications: (userId: string) => Promise<void>;
    loadMoreUserNotifications: (userId: string) => Promise<void>;
    isRefreshingUserNotifications: boolean;
    isLoadingMoreUserNotifications: boolean;
    updateUserNotification: (
        userId: string,
        notificationId: string,
        data: Partial<Notification>,
    ) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>(null!);

export const NotficationTypesToHandle = ["revise-quotation", "application-accepted", "contract-started", "contract-ended", "invitation", "influencer-invite", "influencer-invite-accepted", "influencer-invite-rejected"]

export const useNotificationContext = () => useContext(NotificationContext);

const NOTIFICATIONS_PAGE_SIZE = 20;

export const NotificationContextProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [userNotifications, setUserNotifications] = useState<(Notification)[]>([]);
    const [isRefreshingUserNotifications, setIsRefreshingUserNotifications] = useState(false);
    const [isLoadingMoreUserNotifications, setIsLoadingMoreUserNotifications] = useState(false);
    const [hasMoreUserNotifications, setHasMoreUserNotifications] = useState(true);
    const [lastUserNotificationDoc, setLastUserNotificationDoc] = useState<unknown | null>(null);

    const {
        user,
    } = useAuthContext();

    const startUnreadNotificationsListener = (userId: string) => {
        const userRef = doc(FirestoreDB, "users", userId);
        const notificationsRef = collection(userRef, "notifications");
        const unreadQuery = query(notificationsRef, where("isRead", "==", false));

        return onSnapshot(unreadQuery, (snapshot) => {
            setUnreadNotifications(snapshot.size);
        });
    };

    const refreshUserNotifications = async (userId: string) => {
        if (!userId) return;

        try {
            setIsRefreshingUserNotifications(true);

            const userRef = doc(FirestoreDB, "users", userId);
            const notificationsRef = collection(userRef, "notifications");

            const notificationsQuery = query(
                notificationsRef,
                orderBy("timeStamp", "desc"),
                limit(NOTIFICATIONS_PAGE_SIZE),
            );

            const snapshot = await getDocs(notificationsQuery);

            const notifications: Notification[] = snapshot.docs.map((d) => ({
                ...(d.data() as Notification),
                id: d.id,
            }));

            setUserNotifications(notifications);
            setLastUserNotificationDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
            setHasMoreUserNotifications(snapshot.docs.length === NOTIFICATIONS_PAGE_SIZE);
        } catch (error) {
            Console.error(error, "Error refreshing notifications: ");
        } finally {
            setIsRefreshingUserNotifications(false);
        }
    };

    const loadMoreUserNotifications = async (userId: string) => {
        if (!userId) return;
        if (isLoadingMoreUserNotifications) return;
        if (!hasMoreUserNotifications) return;
        if (!lastUserNotificationDoc) return;

        try {
            setIsLoadingMoreUserNotifications(true);

            const userRef = doc(FirestoreDB, "users", userId);
            const notificationsRef = collection(userRef, "notifications");

            const notificationsQuery = query(
                notificationsRef,
                orderBy("timeStamp", "desc"),
                startAfter(lastUserNotificationDoc as any),
                limit(NOTIFICATIONS_PAGE_SIZE),
            );

            const snapshot = await getDocs(notificationsQuery);

            const notifications: Notification[] = snapshot.docs.map((d) => ({
                ...(d.data() as Notification),
                id: d.id,
            }));

            setUserNotifications((prev) => {
                const existingIds = new Set(prev.map((n) => n.id));
                const merged = [...prev];
                for (const n of notifications) {
                    if (!existingIds.has(n.id)) merged.push(n);
                }
                return merged;
            });

            setLastUserNotificationDoc(snapshot.docs[snapshot.docs.length - 1] ?? lastUserNotificationDoc);
            setHasMoreUserNotifications(snapshot.docs.length === NOTIFICATIONS_PAGE_SIZE);
        } catch (error) {
            Console.error(error, "Error loading more notifications: ");
        } finally {
            setIsLoadingMoreUserNotifications(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            const unsubscribeUnread = startUnreadNotificationsListener(user.id);
            refreshUserNotifications(user.id);
            return () => {
                unsubscribeUnread();
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
                refreshUserNotifications,
                loadMoreUserNotifications,
                isRefreshingUserNotifications,
                isLoadingMoreUserNotifications,
                updateUserNotification,
                userNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
