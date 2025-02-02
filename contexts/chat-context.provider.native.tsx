import { useStreamTheme } from "@/hooks";
import { useTheme } from "@react-navigation/native";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Channel, DefaultGenerics, StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuthContext } from "./auth-context.provider";

const streamClient = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_API_KEY!
);

interface ChatContextProps {
  createGroupWithMembers: (
    groupName: string,
    members: string[]
  ) => Promise<Channel>;
  connectUser: () => void;
  fetchMembers: (channel: string) => Promise<any>;
  sendSystemMessage: (channel: string, message: string) => void;
  fetchChannelCid: (channelId: string) => Promise<string>;
  hasError?: boolean
}

const ChatContext = createContext<ChatContextProps>({
  createGroupWithMembers: async () => Promise.resolve({} as Channel),
  connectUser: async () => { },
  fetchMembers: async () => { },
  sendSystemMessage: async () => { },
  fetchChannelCid: async () => "",
  hasError: false
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const theme = useTheme();
  const { getTheme } = useStreamTheme(theme);
  const [streamChatTheme, setStreamChatTheme] = useState(getTheme());
  const [client, setClient] = useState<StreamChat<DefaultGenerics> | null>(
    null
  );

  useEffect(() => {
    setStreamChatTheme(getTheme());
  }, [theme]);

  const { user } = useAuthContext();

  const connect = async (streamToken: string) => {
    await streamClient
      .connectUser(
        {
          id: user?.id as string,
          name: user?.name as string,
          image: (user?.profileImage as string) || "",
        },
        streamToken
      )
      .then(() => {
        setClient(streamClient);
        setIsReady(true);
      }).catch(e => {
        setIsReady(false);
        setHasError(true);
      });
  };

  const connectUser = async () => {
    console.log("Connecting user");
    const response = await fetch("https://be.trendly.pro/api/v1/chat/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.id}`,
      },
    });

    const data = await response.json();

    if (data.token !== "") {
      await connect(data.token);
    } else {
      throw { message: "Chat not initiated" };
    }
  };

  useEffect(() => {
    if (user?.id) {
      connectUser();
    }

    return () => {
      if (isReady && client) {
        streamClient.disconnectUser();
        setIsReady(false);
      }
    };
  }, [user?.id]);

  const createGroupWithMembers = async (
    groupName: string,
    members: string[]
  ): Promise<Channel> => {
    const response = await fetch("https://be.trendly.pro/api/v1/chat/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.id}`,
      },
      body: JSON.stringify({
        name: groupName,
        userIds: members,
      }),
    });

    const data = await response.json();

    return data.channel;
  };

  const fetchMembers = async (channel: string) => {
    try {
      const channelToWatch = streamClient.channel("messaging", channel);
      await channelToWatch.watch();
      const membersList = Object.values(channelToWatch.state.members);

      return membersList;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChannelCid = async (channelId: string) => {
    const channel = streamClient.channel("messaging", channelId);
    await channel.watch();
    return channel.cid;
  };

  const sendSystemMessage = async (channel: string, message: string) => {
    const channelToWatch = streamClient.channel("messaging", channel);
    const messageToSend = {
      text: message,
      user: {
        id: "system",
        name: "system",
      },
      type: "system",
    };
    channelToWatch.sendMessage(messageToSend);
  };

  return (
    <OverlayProvider value={{ style: streamChatTheme }}>
      <Chat client={streamClient}>
        <ChatContext.Provider
          value={{
            createGroupWithMembers,
            connectUser,
            fetchChannelCid,
            fetchMembers,
            sendSystemMessage,
            hasError,
          }}
        >
          {children}
        </ChatContext.Provider>
      </Chat>
    </OverlayProvider>
  );
};
