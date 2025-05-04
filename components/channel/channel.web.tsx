import { Text, View } from "@/components/theme/Themed";
import { useAuthContext } from "@/contexts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

const ChannelWeb = () => {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const router = useRouter()
  const { user } = useAuthContext()
  useEffect(() => {
    if (user)
      router.push(`/messages?channelId=${cid}`)
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
