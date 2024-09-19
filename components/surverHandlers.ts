import { FirestoreDB } from "@/shared-libs/utilities/firestore";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthApp } from "@/shared-libs/utilities/auth";
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
    const user = await signInWithEmailAndPassword(
      AuthApp,
      "testuser@gmail.com",
      "password"
    );
    const userRef = doc(FirestoreDB, "users", "IjOAHWjc3d8ff8u6Z2rD");
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as IUsers;

      await updateDoc(userRef, {
        preferences: {
          ...userData.preferences,
          question1: answers[0] || "",
          question2: answers[1] || "",
          question3: answers[2] || "",
        },
      });

      console.log("Survey submitted successfully!");
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
