import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { SurveyAnswer } from "@/types/Survey";
import { getFormattedPreferences } from "@/utils/profile";
import { doc, getDoc, updateDoc } from "firebase/firestore";
;
;

export const submitSurvey = async (answers: SurveyAnswer) => {
  try {
    const user = AuthApp.currentUser;
    if (!user) {
      console.error("User not signed in");
      return;
    }
    const userRef = doc(FirestoreDB, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      await updateDoc(userRef, {
        preferences: getFormattedPreferences(userData.preferences, answers),
      });
    } else {
      CrashLog.log("User data does not exist");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
  }
};

export const handleSkipQuestion = () => {
  CrashLog.log("Skipping question");
};
