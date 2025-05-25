import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { addDoc, collection, Firestore } from "firebase/firestore";

export const populateManagers = async (db: Firestore, dummyManagers: any[]) => {
  const managersCollection = collection(db, "managers");

  for (const manager of dummyManagers) {
    const managerRef = await addDoc(managersCollection, {
      name: manager.name,
      email: manager.email,
      phoneNumber: manager.phoneNumber,
      location: manager.location,
      dateOfBirth: manager.dateOfBirth,
    });

    CrashLog.log(`Manager ${manager.name} added successfully.`);

    const notificationsCollection = collection(managerRef, "notifications");

    await addDoc(notificationsCollection, {
      title: "Welcome to Trendly Pro",
      description: "Get started with Trendly Pro today!",
      timeStamp: Date.now(),
      isRead: false,
      type: "message",
    });

    CrashLog.log(
      `Notifications for manager ${manager.name} added successfully.`
    );
  }
};
