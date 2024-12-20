import { FirestoreDB } from "@/utils/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthApp } from "@/utils/auth";
import { SurveyAnswer } from "@/types/Survey";
import { getFormattedPreferences } from "@/utils/profile";

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
      console.log("User data does not exist");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
  }
};

export const handleSkipQuestion = () => {
  console.log("Skipping question");
};
