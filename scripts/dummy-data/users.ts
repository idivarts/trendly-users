enum SocialPlatform {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  YOUTUBE = "YOUTUBE",
  TWITTER = "TWITTER",
  OTHERS = "OTHERS",
}

export const dummyUsers = [
  {
    name: "John Doe",
    email: "john.doe@gmail.com",
    phoneNumber: "1234567890",
    location: "New York, USA",
    preferences: {
      question1: "Answer 1",
      question2: "Answer 2",
      question3: "Answer 3",
    },
    settings: {
      theme: "light",
      emailNotification: true,
      pushNotification: true,
    },
    notifications: [],
    socials: [
      {
        platform: SocialPlatform.TWITTER,
        handle: "@johndoe",
        url: "https://twitter.com/johndoe",
        followers: 1000,
        following: 500,
      },
    ],
  },
];
