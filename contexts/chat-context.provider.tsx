import { useCloudMessagingContext } from "@/shared-libs/contexts/cloud-messaging.provider";
import { Console } from "@/shared-libs/utils/console";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import * as Notification from "expo-notifications";
import { router } from "expo-router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";
import { DefaultGenerics, StreamChat } from "stream-chat";
import { useAuthContext } from "./auth-context.provider";
import StreamWrapper from "./stream-wrapper";
import { streamClient } from "./streamClient";

export { streamClient };
interface ChatContextProps {
  connectUser: () => Promise<string>;
  fetchMembers: (channel: string) => Promise<any>;
  fetchChannelCid: (channelId: string) => Promise<string>;
  hasError?: boolean;
  unreadCount: number;
  isChatConnected?: boolean;
}

const ChatContext = createContext<ChatContextProps>({
  connectUser: async () => "",
  fetchMembers: async () => { },
  fetchChannelCid: async () => "",
  hasError: false,
  unreadCount: 0,
  isChatConnected: false
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState("");
  const [hasError, setHasError] = useState(false)

  const [client, setClient] = useState<StreamChat<DefaultGenerics> | null>(null);
  const [unreadCount, setUnreadCountMain] = useState(0)

  const setUnreadCount = (x: number) => {
    setUnreadCountMain(x);
    if (Platform.OS !== "web")
      Notification.setBadgeCountAsync(x);
  }

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
      listenToNewMessages();
    });
  };

  const listenToNewMessages = async () => {
    if (!streamClient) return;

    const uCount = await streamClient.getUnreadCount()
    setUnreadCount(uCount.total_unread_count);

    const updateReadCount = async () => {
      const unreadCounts = await streamClient.getUnreadCount();
      setUnreadCount(unreadCounts.total_unread_count);
    }

    streamClient.on("notification.message_new", async (event) => {
      if (Platform.OS === "web") {
        const channel = event.channel;
        const message = event.message;

        console.log("Event received:", event);
        Toaster.notification(channel?.name || "New message received", message?.text || "You have a new message", () => {
          if (channel) {
            router.push(`/channel/${channel.cid}`);
          }
        });
      }
      updateReadCount()
    });

    streamClient.on("notification.mark_read", async () => {
      updateReadCount();
    });
    streamClient.on("notification.mark_all_read", async () => {
      updateReadCount();
    });
    streamClient.on("message.new", async (event) => {
      updateReadCount();
    });
    streamClient.on("connection.recovered", async () => {
      updateReadCount();
    });
  }

  const connectUser = async () => {
    if (token) {
      Console.log("Already connected to Chat")
      return token
    }
    Console.log("Connecting to Chat")
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
      Console.log("Error connecting to chat", error);
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
        fetchChannelCid,
        hasError,
        unreadCount,
        isChatConnected: !!token
      }}
    >
      <StreamWrapper>
        {children}
      </StreamWrapper>
    </ChatContext.Provider>
  );
};
