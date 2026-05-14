import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";

export interface RaiseDisputePayload {
    contractId: string;
    type: string;
    description: string;
    evidence?: string[];
}

export interface RequestCancellationPayload {
    contractId: string;
    reason: string;
}

export interface RespondToCancellationPayload {
    contractId: string;
    approve: boolean;
}

export async function raiseDisputeAsInfluencer(payload: RaiseDisputePayload): Promise<void> {
    await HttpWrapper.fetch(
        `/monetize/influencers/contracts/${payload.contractId}/dispute`,
        {
            method: "POST",
            body: JSON.stringify({
                type: payload.type,
                description: payload.description,
                evidence: payload.evidence ?? [],
            }),
        }
    );
}

export async function requestCancellationAsInfluencer(payload: RequestCancellationPayload): Promise<void> {
    await HttpWrapper.fetch(
        `/monetize/influencers/contracts/${payload.contractId}/cancel/request`,
        {
            method: "POST",
            body: JSON.stringify({ reason: payload.reason }),
        }
    );
}

export async function respondToCancellationAsInfluencer(payload: RespondToCancellationPayload): Promise<void> {
    await HttpWrapper.fetch(
        `/monetize/influencers/contracts/${payload.contractId}/cancel/respond`,
        {
            method: "POST",
            body: JSON.stringify({ approve: payload.approve }),
        }
    );
}
