import Chat from "@/components/messages/chat";
import { CONVERSATIONS } from "@/constants/Conversations";
import { Conversation } from "@/types/Conversation";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ChatScreen: React.FC = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.id) {
      const selectedConversation = CONVERSATIONS.find(
        (conversation) => conversation.id === params.id
      );
      setConversation(selectedConversation as Conversation);
    }
  }, [params.id]);

  if (!params.id) {
    <Redirect href="/messages" />;
  }

  if (!conversation) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Chat
      conversation={conversation}
    />
  );
};

export default ChatScreen;
