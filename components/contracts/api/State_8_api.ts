import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State8SubmitPostingPayload {
    contractId: string;
    proofScreenshot: string;
    postUrl: string;
    notes?: string;
}

export async function state8SubmitPosting(payload: State8SubmitPostingPayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.PostScheduled} (${CONTRACT_STATUS_LABELS[ContractStatus.PostScheduled]}) - state8SubmitPosting - POST /monetize/influencers/contracts/:contractId/posting | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/posting`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proofScreenshot: payload.proofScreenshot,
                    postUrl: payload.postUrl,
                    ...(payload.notes ? { notes: payload.notes } : {}),
                }),
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to submit posting details.");
    }
}

export interface State8RequestReschedulePayload {
    contractId: string;
    note: string;
}

export async function state8RequestReschedule(payload: State8RequestReschedulePayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.PostScheduled} (${CONTRACT_STATUS_LABELS[ContractStatus.PostScheduled]}) - state8RequestReschedule - POST /monetize/influencers/contracts/:contractId/posting/request-reschedule | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/posting/request-reschedule`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    note: payload.note,
                }),
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to request reschedule.");
    }
}
