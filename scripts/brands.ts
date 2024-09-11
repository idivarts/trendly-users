import { addDoc, collection, Firestore } from "firebase/firestore";

export const populateBrands = async (
  db: Firestore,
  dummyBrands: any[],
  managerId: string
) => {
  const brandsCollection = collection(db, "brands");

  for (const brand of dummyBrands) {
    const brandRef = await addDoc(brandsCollection, {
      name: brand.name,
      description: brand.description,
      hireRate: brand.hireRate,
      paymentMethodVerfied: brand.paymentMethodVerified,
    });

    console.log(`Brand ${brand.name} added successfully.`);

    const notificationsCollection = collection(brandRef, "notifications");

    if (brand.notifications && brand.notifications.length > 0) {
      for (const notification of brand.notifications) {
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

    console.log(`Notifications for brand ${brand.name} added successfully.`);

    const membersCollection = collection(brandRef, "members");

    if (brand.members && brand.members.length > 0) {
      for (const member of brand.members) {
        await addDoc(membersCollection, {
          brandId: brandRef.id,
          managerId,
          permissions: member.permissions,
        });
      }
    }

    console.log(`Members for brand ${brand.name} added successfully.`);
  }
};
