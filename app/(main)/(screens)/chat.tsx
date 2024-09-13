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

  const {
    getGroupByGroupId,
  } = useGroupContext();

  const fetchGroupByGroupId = async () => {
    if (params.id) {
      const selectedGroup = await getGroupByGroupId(params.id as string);
      setGroup(selectedGroup as Groups);
    }
  };

  useEffect(() => {
    fetchGroupByGroupId();
  }, [params.id]);

  if (!params.id) {
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
