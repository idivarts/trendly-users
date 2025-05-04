
import { PropsWithChildren } from "react";
import { Platform } from "react-native";
import { StreamChat } from "stream-chat";
import {
  ChatContextProvider as ChatProviderNative,
  useChatContext as useChatContextNative,
} from "./chat-context.provider.native";
import {
  ChatContextProvider as ChatProviderWeb,
  useChatContext as useChatContextWeb,
} from "./chat-context.provider.web";

export const useChatContext = () => {
  if (Platform.OS === 'web') {
    return useChatContextWeb();
  }

  return useChatContextNative();
};


export const streamClient = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_API_KEY!
);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  if (Platform.OS === 'web') {
    return (
      <ChatProviderWeb>{children}</ChatProviderWeb>
    )
  }

  return (
    <ChatProviderNative>{children}</ChatProviderNative>
  );
};

export default ChatContextProvider;
