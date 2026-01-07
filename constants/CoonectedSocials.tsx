import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";

export const connectedAccounts = [
    {
        id: "1",
        name: "Trendly",
        handle: "trendly.now",
        platform: SocialPlatform.INSTAGRAM,
        isInstagram: true,
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
        primary: true,
    },
    {
        id: "2",
        name: "Trendly",
        handle: "trendly.now",
        isInstagram: true,
        platform: SocialPlatform.FACEBOOK,
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",

        primary: false,
    },
    {
        id: "3",
        name: "Crowdy Chat",
        isInstagram: true,
        handle: "crowdy.chat",
        platform: SocialPlatform.FACEBOOK,
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
        primary: false,
    },
];
