import { Console } from "@/shared-libs/utils/console";
import { addDoc, collection, Firestore } from "firebase/firestore";

export const populateUsers = async (db: Firestore, dummyUsers: any[]) => {
    const usersCollection = collection(db, "users");

    for (const user of dummyUsers) {
        const userRef = await addDoc(usersCollection, {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            location: user.location,
            dateOfBirth: user.dateOfBirth,
            preferences: user.preferences,
        });

        Console.log(`User ${user.name} added successfully.`);

        const notificationsCollection = collection(userRef, "notifications");

        if (user.notifications && user.notifications.length > 0) {
            for (const notification of user.notifications) {
                await addDoc(notificationsCollection, {
                    title: notification.title,
                    description: notification.description,
                    timeStamp: notification.timeStamp,
                    isRead: notification.isRead,
                    type: notification.type,
                });
            }
        } else {
            await addDoc(notificationsCollection, {
                title: "Welcome to Trendly Pro",
                description: "Start exploring the app today!",
                timeStamp: Date.now(),
                isRead: false,
                type: "message",
            });
        }

        Console.log(`Notifications for user ${user.name} added successfully.`);

        const socialsCollection = collection(userRef, "socials");

        if (user.socials && user.socials.length > 0) {
            for (const social of user.socials) {
                await addDoc(socialsCollection, {
                    userId: userRef.id,
                    platform: social.platform,
                    handle: social.handle,
                    url: social.url,
                    followers: social.followers,
                    following: social.following,
                    posts: social.posts,
                    engagementRate: social.engagementRate,
                });
            }
        }

        Console.log(`Socials for user ${user.name} added successfully.`);
    }
};
