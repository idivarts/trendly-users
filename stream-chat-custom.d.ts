import "stream-chat";

declare module "stream-chat" {
    interface CustomChannelData {
        contractId?: string;
        influencerId?: string;
        name?: string;
        threadType?: string;
        userId?: string;
    }
}
