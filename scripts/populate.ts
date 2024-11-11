import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { dummyBrands } from "./dummy-data/brands";
import { dummyGroups } from "./dummy-data/groups";
import { dummyManagers } from "./dummy-data/managers";
import { dummyUsers } from "./dummy-data/users";
import { populateBrands } from "./brands";
import { populateGroups } from "./groups";
import { populateManagers } from "./managers";
import { populateUsers } from "./users";
import { populateCollaborations } from "./collaboration";
import { populateApplications } from "./invitations";
import { dummyInvitations } from "./dummy-data/invitations";
import { populateContracts } from "./contracts";
import { dummyContracts } from "./dummy-data/contracts";

const firebaseConfig = {
  apiKey: "AIzaSyDHQpInl2OP37roYCByI4thwNpMJrYCFWE",
  authDomain: "trendly-9ab99.firebaseapp.com",
  projectId: "trendly-9ab99",
  storageBucket: "trendly-9ab99.appspot.com",
  messagingSenderId: "799278694891",
  appId: "1:799278694891:web:33c9053ae2c1c6a95ad9ae",
  measurementId: "G-7HR6HKN407",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const populateFirestore = async () => {
  await signInAnonymously(auth);
  // await populateManagers(db, dummyManagers);
  // await populateUsers(db, dummyUsers);
  // await populateBrands(db, dummyBrands, "zJOdLfzEj5wtmHGZ6tO8");
  // await populateGroups(db, dummyGroups);
  // await populateCollaborations(db);
  await populateApplications(
    db,
    //@ts-ignore
    dummyInvitations,
    "wN2N7q7TfTZTMU0VeEk3NSyuc2G3"
  );
  await populateContracts(db, dummyContracts, "wN2N7q7TfTZTMU0VeEk3NSyuc2G3");
};

populateFirestore()
  .then(() => {
    console.log("All data added successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error populating Firestore:", error);
    process.exit(1);
  });
