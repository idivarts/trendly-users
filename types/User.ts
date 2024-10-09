import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";

export type PushNotificationToken = {
  ios?: string[];
  android?: string[];
  web?: string[];
};

export interface User extends IUsers {
  id: string;
  profileImage: string;
  pushNotificationToken: PushNotificationToken;
}
