import { ChannelList } from "stream-chat-expo";

import { Href, router } from "expo-router";
import { useAuthContext } from "@/contexts";
import { View } from "@/components/theme/Themed";
import { Channel as ChannelType } from "stream-chat";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";

const ChannelListScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();
  const {
    user,
  } = useAuthContext();

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
  }

  const customChannelFilterFunction = (channels: ChannelType[]) => {
    if (!channels) {
      return [];
    }

    if (!searchInput) {
      return channels;
    }

    return channels.filter((channel) => {
      return channel.data?.name?.toLowerCase().includes(searchInput.toLowerCase());
    });
  };

  if (!user?.id) {
    return null;
  }

  return (
    <>
      <View
        style={{
          padding: 20,
          paddingBottom: 15,
        }}
      >
        <Searchbar
          onChangeText={handleSearchChange}
          placeholder="Search"
          value={searchInput}
          style={[
            {
              backgroundColor: Colors(theme).platinum
            },
          ]}
        />
      </View>
      <ChannelList
        channelRenderFilterFn={customChannelFilterFunction}
        filters={{
          members: { $in: [user?.id as string] },
        }}
        sort={{ last_updated: -1 }}
        onSelect={(channel) => {
          router.push(`/channel/${channel.cid}` as Href);
        }}
      />
    </>
  );
};

export default ChannelListScreen;
