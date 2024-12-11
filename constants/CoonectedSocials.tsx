import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";

export const connectedAccounts = [
  {
    id: "1",
    name: "Trendly",
    handle: "Trendly.pro",
    platform: SocialPlatform.INSTAGRAM,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
    primary: true,
  },
  {
    id: "2",
    name: "Trendly",
    handle: "Trendly.pro",
    platform: SocialPlatform.FACEBOOK,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",

    primary: false,
  },
  {
    id: "3",
    name: "Crowdy Chat",
    handle: "crowdy.chat",
    platform: SocialPlatform.FACEBOOK,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
    primary: false,
  },
];
