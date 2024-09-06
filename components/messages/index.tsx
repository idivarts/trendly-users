import { Conversation } from "@/types/Conversation";
import MessageCard from "./MessageCard";
import { ScrollView } from "react-native";

interface MessagesProps {
  changeConversation: (conversationId: string) => void;
  conversations: Conversation[];
}

const Messages: React.FC<MessagesProps> = ({
  changeConversation,
  conversations,
}) => {
  const onPress = (conversationId: string) => {
    changeConversation(conversationId);
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 10,
      }}
    >
      {conversations.map((conversation) => (
        <MessageCard
          conversation={conversation}
          key={conversation.id}
          onPress={() => onPress(conversation.id)}
        />
      ))}
    </ScrollView>
  );
};

export default Messages;
