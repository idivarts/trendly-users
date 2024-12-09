export type Profile = {
  name: string;
  emailVerified: boolean | undefined;
  phoneVerified: boolean | undefined;
  category: string[];
  content: {
    about: string | undefined;
    socialMediaHighlight: string | undefined;
    collaborationGoals: string | undefined;
    audienceInsights: string | undefined;
    funFactAboutUser: string | undefined;
  };
  attachments: {
    appleUrl?: string;
    playUrl?: string;
    imageUrl?: string;
    type: "image" | "video";
  }[];
};
