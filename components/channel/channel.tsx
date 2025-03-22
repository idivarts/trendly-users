import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";

import Colors from "@/constants/Colors";
import { useBrandContext, useContractContext } from "@/contexts";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import ChatMessageTopbar from "./chat-message-topbar";

import {
  AttachButton,
  AttachmentPickerSelectionBar,
  CommandsButton,
  MoreOptionsButton,
  SendButton,
} from "./components";

const ChannelNative = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [contract, setContract] = useState<IContracts | null>(null);
  const [brand, setBrand] = useState<IBrands | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();
  const { getContractById } = useContractContext();
  const { getBrandById } = useBrandContext();

  const router = useRouter();
  const theme = useTheme();

  const fetchBrand = async (
    brandId: string,
  ) => {
    const brandData = await getBrandById(brandId);

    if (brandData) {
      setBrand(brandData);
    }
  }

  const fetchContract = async (
    contractId: string,
  ) => {
    const contractData = await getContractById(contractId);
    setContract(contractData);
  }

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);

      if (channels[0]?.data?.contractId) {
        await fetchContract(channels[0]?.data?.contractId as string);
      }
    };

    fetchChannel();
  }, [cid]);

  useEffect(() => {
    if (contract) {
      fetchBrand(contract?.brandId as string);
    }
  }, [contract]);

  useEffect(() => {
    const resetBadgeCount = async () => {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        try {
          await Notifications.setBadgeCountAsync(0);
        } catch (error) {
          console.error("Failed to reset badge count:", error);
        }
      }
    };

    resetBadgeCount();
  }, []);

  if (!channel || !contract) {
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
    <Channel
      AttachButton={AttachButton}
      audioRecordingEnabled
      channel={channel}
      CommandsButton={CommandsButton}
      MoreOptionsButton={MoreOptionsButton}
      SendButton={SendButton}
    >
      <ScreenHeader
        title={channel?.data?.name || 'Chat'}
        rightAction
        rightActionButton={
          <Pressable
            style={{
              // marginRight: 8,
              paddingHorizontal: 16
            }}
            onPress={() => {
              router.push(`/contract-details/${contract.streamChannelId}`);
            }}
          >
            <Avatar.Image
              style={{
                backgroundColor: Colors(theme).transparent,
              }}
              size={40}
              source={imageUrl(brand?.image)}
            />
          </Pressable>
        }
      />
      <ChatMessageTopbar
        contract={{
          ...contract,
          id: channel?.data?.contractId as string,
        }}
      />
      <MessageList />
      <MessageInput
        AttachmentPickerSelectionBar={AttachmentPickerSelectionBar}
      />
    </Channel>
  );
}

export default ChannelNative;
