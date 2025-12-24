import {
    IApplications,
    IInvitations,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";

export interface Invitation extends IInvitations {
    id: string;
}

export interface Application extends IApplications {
    id: string;
}
