import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import {
    IApplications,
    ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";

export interface ICollaborationCard extends IContracts {
    brandData: IBrands;
    applications: IApplications[];
    collaborationData: ICollaboration;
}
