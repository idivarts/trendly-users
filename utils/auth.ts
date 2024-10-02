//@ts-nocheck
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { FirebaseApp } from "./firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

if (!FirebaseApp) {
  throw new Error("Firebase app is not initialized");
}

const AuthApp = initializeAuth(FirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { AuthApp };
