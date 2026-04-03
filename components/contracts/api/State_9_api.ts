import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State9SubmitUserFeedbackPayload {
    contractId: string;
    ratings: number;
    feedbackReview: string;
}

export async function state9SubmitUserFeedback(payload: State9SubmitUserFeedbackPayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.SettlementPending} (${CONTRACT_STATUS_LABELS[ContractStatus.SettlementPending]}) - state9SubmitUserFeedback - POST /api/collabs/contracts/:contractId/user-feedback | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(`/api/collabs/contracts/${payload.contractId}/user-feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ratings: payload.ratings,
                feedbackReview: payload.feedbackReview,
            }),
        });
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to submit feedback.");
    }
}

