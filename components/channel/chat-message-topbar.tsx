import { Channel as ChannelType } from "stream-chat";

import FirstPhase from "./message-topbar/first-phase";
import FourthPhase from "./message-topbar/fourth-phase";
import SecondPhase from "./message-topbar/second-phase";
import ThirdPhase from "./message-topbar/third-phase";

interface ChatMessageTopbarProps {
  channel: ChannelType;
  status: number;
}

const ChatMessageTopbar: React.FC<ChatMessageTopbarProps> = ({
  channel,
  status,
}) => {
  if (status === 0) {
    return <FirstPhase channel={channel} />;
  } else if (status === 1) {
    return <SecondPhase />;
  } else if (status === 2) {
    return <ThirdPhase />;
  } else if (status === 3) {
    return <FourthPhase />;
  } else {
    return null;
  }
}

export default ChatMessageTopbar;
