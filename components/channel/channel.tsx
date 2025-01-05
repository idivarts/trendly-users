import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";

import ChatMessageTopbar from "./chat-message-topbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";

const ChannelNative = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();

  const theme = useTheme();

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    };

    fetchChannel();
  }, [cid]);

  if (!channel) {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Channel channel={channel} audioRecordingEnabled>
      <ScreenHeader
        title={channel?.data?.name || 'Chat'}
        rightAction
        rightActionButton={
          <View
            style={{
              marginRight: 18,
              marginLeft: 12,
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              size={20}
              color={Colors(theme).black}
            />
            {/* TODO: Brand image here. */}
          </View>
        }
      />
      <ChatMessageTopbar
        status={0}
      />
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

export default ChannelNative;
