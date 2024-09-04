import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "trendly-9ab99.firebaseapp.com",
  projectId: "trendly-9ab99",
  storageBucket: "trendly-9ab99.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: "G-7HR6HKN407",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const FirebaseApp = firebase.app();

const AuthApp = auth(FirebaseApp);

export { FirebaseApp, AuthApp };
