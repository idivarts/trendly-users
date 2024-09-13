import {
  IGroups,
  IMessages,
} from "@/shared-libs/firestore/trendly-pro/models/groups";

export interface Groups extends IGroups {
  // TODO: Finalize the structure of the Groups type
  id: string;
  collaboration?: any;
  image: string;
  latestMessage?: IMessages | null;
  users: any[];
  managers: any[];
}
