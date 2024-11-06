import ChannelListNative from "@/components/channel/channel";
import ChannelListWeb from "@/components/channel/channel.web";
import { Platform } from "react-native";

const ChannelScreen = () => {
  if (Platform.OS === 'web') {
    return <ChannelListWeb />
  }
  return (
    <ChannelListNative />
  );
}

export default ChannelScreen;
