import Chat from "@/components/messages/chat";
import Colors from "@/constants/Colors";
import { useAuthContext, useGroupContext } from "@/contexts";
import { Groups } from "@/types/Groups";
import { useTheme } from "@react-navigation/native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

const ChatScreen: React.FC = () => {
  const [group, setGroup] = useState<Groups | null>(null);
  const params = useLocalSearchParams();
  const theme = useTheme();
  const { chatId } = params;

  const {
    getGroupByGroupId,
    updateGroup,
  } = useGroupContext();
  const {
    user,
  } = useAuthContext();

  const fetchGroupByGroupId = async () => {
    if (chatId) {
      const selectedGroup = await getGroupByGroupId(chatId as string);
      setGroup(selectedGroup as Groups);
    }
  };

  useEffect(() => {
    fetchGroupByGroupId();
  }, [chatId]);

  useEffect(() => {
    if (group && user) {
      if (!group.lastUserReadTime?.[user.id as string]) {
        updateGroup(group.id as string, {
          lastUserReadTime: {
            ...group.lastUserReadTime,
            [user.id as string]: Date.now(),
          },
        });
        return;
      }

      updateGroup(group.id as string, {
        lastUserReadTime: {
          ...group.lastUserReadTime,
          [user.id as string]: Date.now(),
        },
      });
    }
  }, [group]);

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
        <ActivityIndicator size="large" color={Colors(theme).primary} />
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
