import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";

export const DUMMY_USER_ID = "IjOAHWjc3d8ff8u6Z2rD";

export const DUMMY_IMAGE =
  "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png";

export const INITIAL_USER_DATA: Partial<IUsers> = {
  profileImage: "",
  phoneNumber: "",
  location: "",
  isVerified: false,
  profile: {
    completionPercentage: 0,
    content: {
      about: "",
      socialMediaHighlight: "",
      collaborationGoals: "",
      audienceInsights: "",
      funFactAboutUser: "",
    },
    introVideo: "",
    category: [],
    attachments: [],
    timeCommitment: "",
  },
  settings: {
    emailNotification: true,
    pushNotification: true,
    theme: "light",
  },
  pushNotificationToken: {
    ios: [],
    android: [],
    web: [],
  },
};

export const DUMMY_USER_CREDENTIALS: Partial<IUsers> = {
  name: "John Doe",
  profileImage: "",
  email: "john.doe@gmail.com",
  phoneNumber: "",
  location: "",
  isVerified: false,
  settings: {
    emailNotification: true,
    pushNotification: true,
    theme: "dark",
  },
  pushNotificationToken: {
    ios: [],
    android: [],
    web: [],
  },
};

export const DUMMY_PASSWORD = "password";
