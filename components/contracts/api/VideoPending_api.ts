import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State5SubmitDeliverablePayload {
    contractId: string;
    video: Blob | File;
    videoName: string;
    videoType: string;
    note?: string;
}
export async function state5SubmitDeliverable(payload: State5SubmitDeliverablePayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.VideoPending} (${CONTRACT_STATUS_LABELS[ContractStatus.VideoPending]}) - state5SubmitDeliverable - POST /monetize/influencers/contracts/:contractId/deliverable | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );

        const body = new FormData();
        // FormData supports Blob/File; filename is important for backend parsing.
        body.append("video", payload.video as any, payload.videoName);
        if (payload.note) {
            body.append("note", payload.note);
        }

        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/deliverable`,
            {
                method: "POST",
                // Let the runtime set the correct multipart boundary.
                body,
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to submit deliverable.");
    }
}
