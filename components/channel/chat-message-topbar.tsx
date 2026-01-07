import { CHAT_MESSAGE_TOPBAR_DESCRIPTION } from "@/constants/ChatMessageTopbar";
import { useMyNavigation } from "@/shared-libs/utils/router";
import MessageTopbar from "@/shared-uis/components/chat-message-bar";
import { View } from "@/shared-uis/components/theme/Themed";
import { Contract } from "@/types/Contract";
import { useState } from "react";
import Button from "../ui/button";

interface ChatMessageTopbarProps {
    contract: Contract;
}

const ChatMessageTopbar: React.FC<ChatMessageTopbarProps> = ({
    contract,
}) => {
    const [status, setStatus] = useState(contract.status);
    const router = useMyNavigation();

    if (status === 0 || status == 2) {
        return <MessageTopbar
            actions={
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        gap: 16,
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        size="small"
                        mode="text"
                        onPress={() => {
                            router.push(`/contract-details/${contract.streamChannelId}`)
                        }}
                    >
                        {contract.status == 0 ? "Open Collaboration Application" : "Give Feedback"}
                    </Button>
                </View>
            }
            description={contract.status == 0 ? CHAT_MESSAGE_TOPBAR_DESCRIPTION.first : CHAT_MESSAGE_TOPBAR_DESCRIPTION.third}
        />
    } else {
        return null;
    }
}

export default ChatMessageTopbar;
