import { IPreferences } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Profile } from "@/types/Profile";
import { SurveyAnswer } from "@/types/Survey";

export const calculateProfileCompletion = (profile: Profile) => {
  const totalFields = 10;
  let completedFields = 0;

  if (profile?.name) {
    completedFields++;
  }

  if (profile?.emailVerified) {
    completedFields++;
  }

  if (profile?.phoneVerified) {
    completedFields++;
  }

  if (profile?.category?.length > 0) {
    completedFields++;
  }

  Object.values(profile?.content).forEach((value) => {
    if (value) {
      completedFields++;
    }
  });

  if (profile?.attachments?.length > 0) {
    completedFields++;
  }

  return Math.floor((completedFields / totalFields) * 100);
};

export const truncateText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

export const getFormattedPreferences = (
  preferences: IPreferences,
  answers: SurveyAnswer
) => {
  return {
    ...preferences,
    preferredBrandIndustries: answers.question1,
    contentCategory: answers.question2,
    contentWillingToPost: answers.question3,
    preferredLanguages: answers.question4,
  };
};
