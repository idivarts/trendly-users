//@ts-nocheck
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { FirebaseApp } from "./firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

let AuthApp: Auth;

if (!getAuth(FirebaseApp)._isInitialized) {
  AuthApp = initializeAuth(FirebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("AuthApp initialized");
} else {
  AuthApp = getAuth(FirebaseApp);
  console.log("AuthApp reused");
}

export { AuthApp };
