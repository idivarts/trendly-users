import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State5SubmitDeliverablePayload {
    contractId: string;
    videoUrl: string;
    note?: string;
}
export async function state5SubmitDeliverable(payload: State5SubmitDeliverablePayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.VideoPending} (${CONTRACT_STATUS_LABELS[ContractStatus.VideoPending]}) - state5SubmitDeliverable - POST /monetize/influencers/contracts/:contractId/deliverable | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/deliverable`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoUrl: payload.videoUrl,
                    ...(payload.note ? { note: payload.note } : {}),
                }),
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to submit deliverable.");
    }
}

