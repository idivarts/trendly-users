enum SocialPlatform {
  TWITTER = "TWITTER",
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  LINKEDIN = "LINKEDIN",
}

export const dummyUsers = [
  {
    name: "John Doe",
    email: "john.doe@gmail.com",
    phoneNumber: "1234567890",
    location: "New York, USA",
    dateOfBirth: "1989-12-05",
    preferences: {
      theme: "light",
      question1: "Answer 1",
      question2: "Answer 2",
      question3: "Answer 3",
    },
    notifications: [],
    socials: [
      {
        platform: SocialPlatform.TWITTER,
        handle: "@johndoe",
        url: "https://twitter.com/johndoe",
        followers: 1000,
        following: 500,
        posts: 200,
        engagementRate: 5.0,
      },
    ],
  },
];
