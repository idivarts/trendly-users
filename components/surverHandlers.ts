import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { SurveyAnswer } from "@/types/Survey";
import { getFormattedPreferences } from "@/utils/profile";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const submitSurvey = async (answers: SurveyAnswer) => {
  try {
    const user = AuthApp.currentUser;
    if (!user) {
      Console.error("User not signed in");
      return;
    }
    const userRef = doc(FirestoreDB, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as IUsers;
      const user: Partial<IUsers> = {
        preferences: getFormattedPreferences(userData.preferences || {}, answers),
        location: answers.question3?.[0] || "",
        profile: {
          ...userData?.profile,
          category: answers.question2
        }
      }
      await updateDoc(userRef, user);
    } else {
      Console.log("User data does not exist");
    }
  } catch (error) {
    Console.error(error);
  }
};

export const handleSkipQuestion = () => {
  Console.log("Skipping question");
};
