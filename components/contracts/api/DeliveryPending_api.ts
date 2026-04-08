import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State4MarkReceivedPayload {
    contractId: string;
    photoUrl: string;
    notes?: string;
}

export async function state4MarkProductReceived(payload: State4MarkReceivedPayload) {
    try {
        console.log(
            `[ContractFlow] State ${ContractStatus.DeliveryPending} (${CONTRACT_STATUS_LABELS[ContractStatus.DeliveryPending]}) - state4MarkProductReceived - POST /monetize/influencers/contracts/:contractId/shipment/received | ${JSON.stringify(
                { contractId: payload.contractId }
            )}`
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.contractId}/shipment/received`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    photoUrl: payload.photoUrl,
                    ...(payload.notes ? { notes: payload.notes } : {}),
                }),
            }
        );
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to submit product received details.");
    }
}
