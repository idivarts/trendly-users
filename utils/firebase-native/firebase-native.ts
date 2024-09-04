// import messaging from "@react-native-firebase/messaging";
// import dynamicLinks, {
//   FirebaseDynamicLinksTypes,
// } from "@react-native-firebase/dynamic-links";

// // Request permission to use notifications on iOS
// export const requestUserPermission = async (): Promise<void> => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log("Authorization status:", authStatus);
//   }
// };

// export const getFCMToken = async (): Promise<void> => {
//   const fcmToken = await messaging().getToken();
//   if (fcmToken) {
//     console.log("FCM Token:", fcmToken);
//   } else {
//     console.log("Failed to get FCM token");
//   }
// };

// export const onMessageBackgroundHandler = (): void => {
//   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log("Message handled in the background!", remoteMessage);
//   });
// };

// export const setupDynamicLinks = (): void => {
//   dynamicLinks().onLink((link: FirebaseDynamicLinksTypes.DynamicLink) => {
//     console.log("Handling dynamic link:", link.url);
//   });

//   dynamicLinks()
//     .getInitialLink()
//     .then((link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
//       if (link) {
//         console.log("Handling initial dynamic link:", link.url);
//       }
//     });
// };
