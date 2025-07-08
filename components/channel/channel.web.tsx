import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const ChannelWeb = () => {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const router = useMyNavigation()
  const { user } = useAuthContext()
  useEffect(() => {
    if (user)
      router.push(`/messages?channelId=${cid?.split(":")[1]}`)
  }, [user])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Stream is loading...</Text>
    </View>
  );
};

export default ChannelWeb;
