/**
 * State 7 (Release Planning) is brand-owned and read-only for influencer.
 * Wrapper kept for state API parity.
 */
import { ContractStatus, CONTRACT_STATUS_LABELS } from "@/shared-constants/contract-status";

export interface State7ReadOnlyPayload {
    streamChannelId: string;
    newScheduledDate?: number;
}

export async function state7ReadReleasePlan(_payload: State7ReadOnlyPayload) {
    console.log(
        `[ContractFlow] State ${ContractStatus.PostingPending} (${CONTRACT_STATUS_LABELS[ContractStatus.PostingPending]}) - state7ReadReleasePlan - No API (read-only for influencer)`
    );
    return;
}

