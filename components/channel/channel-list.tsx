import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import { ChannelList } from "stream-chat-expo";
import { Channel as ChannelType } from "stream-chat";

import { useAuthContext } from "@/contexts";
import { View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const ChannelListNative = () => {
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();

  const {
    user,
  } = useAuthContext();

  if (!user?.id) {
    return null;
  }

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

  return (
    <>
      <View
        style={{
          padding: 16,
          paddingTop: 16,
        }}
      >
        <Searchbar
          icon={() => (
            <FontAwesomeIcon
              color={Colors(theme).gray100}
              icon={faMagnifyingGlass}
              size={22}
            />
          )}
          onChangeText={handleSearchChange}
          placeholder="Search"
          placeholderTextColor={Colors(theme).gray100}
          value={searchInput}
          style={[
            {
              borderRadius: 15,
              backgroundColor: Colors(theme).aliceBlue
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
          router.push(`/channel/${channel.cid}`);
        }}
      />
    </>
  );
};

export default ChannelListNative;
