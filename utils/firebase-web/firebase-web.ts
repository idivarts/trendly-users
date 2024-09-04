// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { FirebaseApp } from "../firebase";

// const messaging = getMessaging(FirebaseApp);

// export const requestWebNotificationPermission = async (): Promise<void> => {
//   try {
//     const currentToken = await getToken(messaging, {
//       vapidKey: "WEB_PUSH_CERTIFICATE_KEY",
//     });
//     if (currentToken) {
//       console.log("Web FCM Token:", currentToken);
//     } else {
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//     }
//   } catch (error) {
//     console.error("An error occurred while retrieving token.", error);
//   }
// };

// export const onWebMessageListener = (): void => {
//   onMessage(messaging, (payload) => {
//     console.log("Message received. ", payload);
//   });
// };
