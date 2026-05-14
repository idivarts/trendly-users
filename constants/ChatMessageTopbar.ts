import { ContractStatus } from "@/shared-libs/firestore/trendly-pro/models/contracts";

export const CHAT_MESSAGE_TOPBAR_DESCRIPTION: Partial<Record<ContractStatus, string>> = {
    [ContractStatus.Pending]:
        "Your contract is ready. Waiting for the brand to confirm payment before things kick off.",
    [ContractStatus.DeliveryAcknowledgementPending]:
        "Received the product? Confirm receipt from the contract screen to move things forward.",
    [ContractStatus.VideoPending]:
        "Time to create! Upload your collaboration video from the contract details screen.",
    [ContractStatus.PostingPending]:
        "Your video is approved. Post it on the scheduled date and mark it as posted.",
    [ContractStatus.SettlementPending]:
        "The video is live! You can share feedback about this collaboration.",
};
