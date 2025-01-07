import { createContext, PropsWithChildren, useContext } from "react";
import { useAuthContext } from "./auth-context.provider";

interface ChatContextProps {
  createGroupWithMembers: (
    groupName: string,
    members: string[]
  ) => Promise<any>;
  connectUser: () => void;
  fetchMembers: (channel: any) => Promise<any>;
  addMemberToChannel: (channel: any, member: string) => void;
  sendSystemMessage: (channel: any, message: string) => void;
  fetchChannelCid: (channelId: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextProps>({
  createGroupWithMembers: async () => {},
  connectUser: async () => {},
  addMemberToChannel: async () => {},
  fetchMembers: async () => {},
  sendSystemMessage: async () => {},
  fetchChannelCid: async () => "",
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAuthContext();

  const createGroupWithMembers = async (
    groupName: string,
    members: string[]
  ): Promise<any> => {
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

  const connectUser = async () => {
    return null;
  };

  const fetchMembers = async (channel: any): Promise<any> => {};

  const addMemberToChannel = async (channel: any, member: string) => {};

  const sendSystemMessage = async (channel: any, message: string) => {};

  const fetchChannelCid = async (channelId: string): Promise<string> => {
    return "";
  };

  return (
    <ChatContext.Provider
      value={{
        createGroupWithMembers,
        connectUser,
        addMemberToChannel,
        fetchMembers,
        sendSystemMessage,
        fetchChannelCid,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
