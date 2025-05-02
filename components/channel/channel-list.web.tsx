import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import { useChatContext } from "@/contexts/chat-context.provider.web";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { View } from "../theme/Themed";
import EmptyMessageState from "./empty-message-state";

const ChannelListWeb = () => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuthContext()
  const { connectUser } = useChatContext()
  const params = useLocalSearchParams()

  const fetchToken = async () => {
    setLoading(true)
    const token = await connectUser()
    if (token) {
      setToken(token)
    }
    setLoading(false)
  }

  useEffect(() => {
    window.addEventListener('message', function (event) {
      console.log("Received event from ifram");
      if (event.data.type == "open-contract") {
        const contractId = event.data.data
        router.push(`/contract-details/${contractId}`);
        // window.location.href = event.data.replace('redirect:', '');
      }
    });
  }, [])

  useEffect(() => {
    if (user)
      fetchToken()
  }, [user])

  if (loading) {
    return <AppLayout>
      <View style={{ flex: 1, alignItems: "center", padding: 24 }}>
        <ActivityIndicator color={Colors(theme).primary} />
      </View>
    </AppLayout>
  }
  if (!token) {
    return <EmptyMessageState />
  }
  return (
    <Fragment>
      {
        params.channelId ?
          <iframe
            src={`/messenger/index.html?channelId=${params.channelId}&user=${user?.id}&user_token=${token}&target_origin=${window.location.origin}&skip_name_image_set=false&no_channel_name_filter=false`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          /> : <iframe
            src={`/messenger/index.html?user=${user?.id}&user_token=${token}&target_origin=${window.location.origin}&skip_name_image_set=false&no_channel_name_filter=false`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
      }
    </Fragment>
  );
};

export default ChannelListWeb;
