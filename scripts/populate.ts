import { Console } from "@/shared-libs/utils/console";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const populateFirestore = async () => {
    // await populateManagers(db, dummyManagers);
    // await populateUsers(db, dummyUsers);
    // await populateBrands(db, dummyBrands, "zJOdLfzEj5wtmHGZ6tO8");
    // await populateGroups(db, dummyGroups);
    // await populateCollaborations(db);
    // await populateApplications(
    //   db,
    //   //@ts-ignore
    //   dummyInvitations,
    //   "09cNbHT14AYyy1t2joVL3aMeRMm1"
    // );
    // await populateContracts(
    //   db,
    //   dummyContracts,
    //   "09cNbHT14AYyy1t2joVL3aMeRMm1"
    // );
};

populateFirestore()
    .then(() => {
        Console.log("All data added successfully.");
        process.exit(0);
    })
    .catch((error) => {
        Console.error(error, "Error populating Firestore");
        process.exit(1);
    });
