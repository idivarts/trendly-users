import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Searchbar } from "react-native-paper";
import { Channel as ChannelType } from "stream-chat";
import { ChannelList } from "stream-chat-expo";

import { View } from "@/components/theme/Themed";
import { useAuthContext, useChatContext } from "@/contexts";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import stylesFn from "@/styles/searchbar/Searchbar.styles";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import EmptyMessageState from "./empty-message-state";

const ChannelListNative = () => {
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();
  const styles = stylesFn(theme);
  const router = useMyNavigation()

  const {
    user,
  } = useAuthContext();

  const { hasError, connectUser } = useChatContext();

  useFocusEffect(
    useCallback(() => {
      if (hasError) {
        Console.log("Messages is in focus.. Running connectUser");
        connectUser();
      }
    }, [])
  );

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
          flexDirection: "row",
        }}
      >
        <Searchbar
          icon={() => (
            <FontAwesomeIcon
              color={Colors(theme).gray100}
              icon={faMagnifyingGlass}
              size={18}
            />
          )}
          iconColor={Colors(theme).gray100}
          inputStyle={styles.searchbarInput}
          onChangeText={handleSearchChange}
          placeholder="Search"
          placeholderTextColor={Colors(theme).gray100}
          style={styles.searchbar}
          value={searchInput}
        />
      </View>
      {hasError ? <EmptyMessageState listType="channel" /> :
        <View style={{ flex: 1, paddingRight: 16, paddingLeft: 12 }}>
          <ChannelList
            EmptyStateIndicator={EmptyMessageState}
            // LoadingErrorIndicator={EmptyMessageState}
            channelRenderFilterFn={customChannelFilterFunction}
            filters={{
              members: { $in: [user?.id as string] },
            }}
            sort={{ last_updated: -1 }}
            onSelect={(channel) => {
              router.push(`/channel/${channel.cid}`);
            }}
          />
        </View>}
    </>
  );
};

export default ChannelListNative;
