import { ChannelList } from "stream-chat-expo";

import { Href, router } from "expo-router";
import { useAuthContext } from "@/contexts";

const ChannelListScreen = () => {
  const {
    user,
  } = useAuthContext();

  if (!user?.id) {
    return null;
  }

  return (
    <ChannelList
      filters={{
        members: { $in: [user?.id as string] },
      }}
      sort={{ last_updated: -1 }}
      onSelect={(channel) => {
        router.push(`/channel/${channel.cid}` as Href);
      }}
    />
  );
};

export default ChannelListScreen;
