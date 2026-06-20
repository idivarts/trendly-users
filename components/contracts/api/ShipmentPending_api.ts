import { streamClient } from "@/contexts/streamClient";
import { CONTRACT_STATUS_LABELS, ContractStatus } from "@/shared-constants/contract-status";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";

const PAYMENT_NUDGE_MESSAGE =
    "Hi! Just a friendly reminder to complete the payment for our collaboration. Thank you.";
const SHIPMENT_NUDGE_MESSAGE =
    "Hi! Could you please share shipment details once dispatched? Thank you.";
const START_CONTRACT_MESSAGE =
    "Hi! Could you please start the contract once payment is completed? Thank you.";
const COMPLETE_PAYMENT_MESSAGE =
    "Hi! Just a friendly reminder to complete the payment for our collaboration. Thank you.";
const RETRY_PAYMENT_MESSAGE =
    "Hi! The payment seems to have failed. Could you please retry the payment so we can proceed?";

export interface State3NudgePayload {
    streamChannelId: string;
    message?: string;
}

function logStateApi(state: ContractStatus, stateApiFnName: string, apiName: string, extra?: Record<string, unknown>) {
    const stateLabel = CONTRACT_STATUS_LABELS[state];
    console.log(
        `[ContractFlow] State ${state} (${stateLabel}) - ${stateApiFnName} - ${apiName}` +
        (extra ? ` | ${JSON.stringify(extra)}` : "")
    );
}

async function sendChannelNudge(
    state: ContractStatus,
    stateApiFnName: string,
    payload: State3NudgePayload,
    fallbackMessage: string
) {
    try {
        logStateApi(state, stateApiFnName, "Stream: channel.sendMessage", {
            streamChannelId: payload.streamChannelId,
        });
        const channel = streamClient.channel("messaging", payload.streamChannelId);
        await channel.watch();
        await channel.sendMessage({
            text: payload.message || fallbackMessage,
        });
    } catch (error) {
        const parsed = await HttpWrapper.extractErrorMessage(error);
        throw new Error(parsed || "Failed to send nudge message.");
    }
}

export async function state3NudgeBrandForPayment(payload: State3NudgePayload) {
    return sendChannelNudge(
        ContractStatus.ShipmentPending,
        "state3NudgeBrandForPayment",
        payload,
        PAYMENT_NUDGE_MESSAGE
    );
}

export async function state3NudgeForShipment(payload: State3NudgePayload) {
    try {
        logStateApi(
            ContractStatus.ShipmentPending,
            "state3NudgeForShipment",
            "POST /monetize/influencers/contracts/:contractId/shipment/request",
            { contractId: payload.streamChannelId }
        );
        await HttpWrapper.fetch(
            `/monetize/influencers/contracts/${payload.streamChannelId}/shipment/request`,
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
        throw new Error(parsed || "Failed to request shipment.");
    }
}

export async function state0AskToStartContract(payload: State3NudgePayload) {
    return sendChannelNudge(ContractStatus.Pending, "state0AskToStartContract", payload, START_CONTRACT_MESSAGE);
}

export async function state1AskToCompletePayment(payload: State3NudgePayload) {
    return sendChannelNudge(ContractStatus.Pending, "state1AskToCompletePayment", payload, COMPLETE_PAYMENT_MESSAGE);
}

export async function state2AskRetryPayment(payload: State3NudgePayload) {
    return sendChannelNudge(ContractStatus.PaymentFailed, "state2AskRetryPayment", payload, RETRY_PAYMENT_MESSAGE);
}
