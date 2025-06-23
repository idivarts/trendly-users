import { IPreferences, IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { SurveyAnswer } from "@/types/Survey";

export const calculateProfileCompletion = (user: Partial<IUsers>) => {
  const totalFields = 17;
  let completedFields = 0;

  if (user?.name) {
    completedFields++;
  }
  if (user?.profileImage) {
    completedFields++;
  }
  if (user?.phoneNumber) {
    completedFields++;
  }
  if ((user?.profile?.category?.length || 0) > 0) {
    completedFields++;
  }
  if (user?.location) {
    completedFields++;
  }

  Object.values(user?.profile?.content || {}).forEach((value) => {
    if (value) {
      completedFields++;
    }
  });

  if ((user?.profile?.attachments?.length || 0) > 0) {
    completedFields += (user?.profile?.attachments?.length || 0);
  }

  if (user?.preferences) {
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
    // contentCategory: answers.question2,
    // contentWillingToPost: answers.question3,
    // preferredLanguages: answers.question4,
  };
};
