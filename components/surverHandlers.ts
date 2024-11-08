import { FirestoreDB } from "@/utils/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthApp } from "@/utils/auth";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { useRouter } from "expo-router";

export const handleNextQuestion = (
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>,
  selectedOption: string | null
) => {
  if (currentQuestionIndex < 2) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
  }
};

export const submitSurvey = async (answers: string[]) => {
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
        preferences: {
          ...userData.preferences,
          question1: answers[0] || "",
          question2: answers[1] || "",
          question3: answers[2] || "",
        },
      });
    } else {
      console.log("User data does not exist");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
  }
};

export const handlePreviousQuestion = (
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setSelectedOption(null);
  }
};

export const handleSkipQuestion = () => {
  console.log("Skipping question");
};
