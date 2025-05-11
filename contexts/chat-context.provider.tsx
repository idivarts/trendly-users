import { useCloudMessagingContext } from "@/shared-libs/contexts/cloud-messaging.provider";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { DefaultGenerics, StreamChat } from "stream-chat";
import { useAuthContext } from "./auth-context.provider";
import StreamWrapper from "./stream-wrapper";

export const streamClient = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_API_KEY!
);

interface ChatContextProps {
  connectUser: () => Promise<string>;
  fetchMembers: (channel: string) => Promise<any>;
  // sendSystemMessage: (channel: string, message: string) => void;
  fetchChannelCid: (channelId: string) => Promise<string>;
  hasError?: boolean;
}

const ChatContext = createContext<ChatContextProps>({
  connectUser: async () => "",
  fetchMembers: async () => { },
  // sendSystemMessage: async () => { },
  fetchChannelCid: async () => "",
  hasError: false,
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState("");
  const [hasError, setHasError] = useState(false)

  const [client, setClient] = useState<StreamChat<DefaultGenerics> | null>(null);

  const { getToken, registerPushTokenWithStream } = useCloudMessagingContext()

  const { user } = useAuthContext();

  const connectStream = async (streamToken: string) => {
    await streamClient.connectUser({
      id: user?.id as string,
      name: user?.name as string,
      image: (user?.profileImage as string) || "",
    }, streamToken).then(async () => {
      setClient(streamClient);
      setToken(streamToken);
      setHasError(false);
      registerPushTokenWithStream(await getToken())
    });
  };

  const connectUser = async () => {
    if (token) {
      console.log("Already connected to Chat")
      return token
    }
    console.log("Connecting to Chat")
    try {
      const response = await HttpWrapper.fetch("/api/v1/chat/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!!data.token) {
        await connectStream(data.token);
        return (data.token as string)
      } else {
        throw { message: "No token provided" }
      }
    } catch (error) {
      console.log("Error connecting to chat", error);
      setToken("")
      setHasError(true)
    }
    return ""
  };

  useEffect(() => {
    if (user) {
      connectUser();
    }

    return () => {
      if (token && client) {
        streamClient.disconnectUser();
        setToken("");
      }
    };
  }, [user]);


  const fetchMembers = async (channel: string) => {
    const channelToWatch = streamClient.channel("messaging", channel);
    await channelToWatch.watch();
    const membersList = Object.values(channelToWatch.state.members);

    return membersList;
  };

  // const sendSystemMessage = async (channel: string, message: string) => {
  //   const channelToWatch = streamClient.channel("messaging", channel);
  //   const messageToSend = {
  //     text: message,
  //     user: {
  //       id: "system",
  //       name: "system",
  //     },
  //     type: "system",
  //   };
  //   channelToWatch.sendMessage(messageToSend);
  // };

  const fetchChannelCid = async (channelId: string) => {
    const channel = streamClient.channel("messaging", channelId);
    await channel.watch();
    return channel.cid;
  };

  return (
    <ChatContext.Provider
      value={{
        connectUser,
        fetchMembers,
        // sendSystemMessage,
        fetchChannelCid,
        hasError,
      }}
    >
      <StreamWrapper>
        {children}
      </StreamWrapper>
    </ChatContext.Provider>
  );
};
