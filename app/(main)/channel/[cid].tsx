import ChannelNative from "@/components/channel/channel";
import ChannelWeb from "@/components/channel/channel.web";
import AppLayout from "@/layouts/app-layout";
import { Platform } from "react-native";

const ChannelScreen = () => {
  if (Platform.OS === 'web') {
    return <ChannelWeb />
  }
  return (
    <AppLayout>
      <ChannelNative />
    </AppLayout>
  );
}

export default ChannelScreen;
