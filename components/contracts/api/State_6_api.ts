import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export { state5SubmitDeliverable as state6MarkVideoReuploaded } from "./State_5_api";

export interface State6RequestApprovalPayload {
    contractId: string;
}

export async function state6RequestApproval(payload: State6RequestApprovalPayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.ReviewPending} (${CONTRACT_STATUS_LABELS[ContractStatus.ReviewPending]}) - state6RequestApproval - POST /monetize/influencers/contracts/:contractId/deliverable/request-approval | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/deliverable/request-approval`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to request approval.");
    }
}

