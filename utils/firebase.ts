import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDHQpInl2OP37roYCByI4thwNpMJrYCFWE",
  authDomain: "trendly-9ab99.firebaseapp.com",
  projectId: "trendly-9ab99",
  storageBucket: "trendly-9ab99.appspot.com",
  messagingSenderId: "799278694891",
  appId: "1:799278694891:web:33c9053ae2c1c6a95ad9ae",
  measurementId: "G-7HR6HKN407",
};

const FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export { FirebaseApp };
