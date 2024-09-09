import { Conversation } from "@/types/Conversation";
import MessageCard from "./MessageCard";
import { ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";

interface MessagesProps {
  changeConversation: (conversationId: string) => void;
  conversations: Conversation[];
}

const Messages: React.FC<MessagesProps> = ({
  changeConversation,
  conversations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  const onPress = (conversationId: string) => {
    changeConversation(conversationId);
  }

  useEffect(() => {
    setFilteredConversations(
      conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [conversations, searchQuery]);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 10,
      }}
    >
      <Searchbar
        onChangeText={setSearchQuery}
        placeholder="Search"
        value={searchQuery}
        style={{
          backgroundColor: Colors.regular.platinum,
          marginHorizontal: 10,
        }}
      />
      {filteredConversations.map((conversation) => (
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
