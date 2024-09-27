import Chat from "@/components/messages/chat";
import { useGroupContext } from "@/contexts";
import { Groups } from "@/types/Groups";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ChatScreen: React.FC = () => {
  const [group, setGroup] = useState<Groups | null>(null);
  const params = useLocalSearchParams();
  const { chatId } = params;

  const {
    getGroupByGroupId,
  } = useGroupContext();

  const fetchGroupByGroupId = async () => {
    if (chatId) {
      const selectedGroup = await getGroupByGroupId(chatId as string);
      setGroup(selectedGroup as Groups);
    }
  };

  useEffect(() => {
    fetchGroupByGroupId();
  }, [chatId]);

  if (!chatId) {
    <Redirect href="/messages" />;
  }

  if (!group) {
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
      group={group}
    />
  );
};

export default ChatScreen;
