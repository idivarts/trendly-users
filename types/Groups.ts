import {
  IGroups,
  IMessages,
} from "@/shared-libs/firestore/trendly-pro/models/groups";

export interface Groups extends IGroups {
  // TODO: Finalize the structure of the Groups type
  id: string;
  collaboration?: any;
  image: string;
  users: any[];
  managers: any[];
}
