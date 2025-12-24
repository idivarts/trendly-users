import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageInput, MessageList } from "stream-chat-expo";

import { useAuthContext, useBrandContext, useChatContext, useContractContext } from "@/contexts";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import Colors from "@/shared-uis/constants/Colors";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import ChatMessageTopbar from "./chat-message-topbar";

import { streamClient } from "@/contexts/streamClient";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
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
    const { user } = useAuthContext()

    const { isChatConnected } = useChatContext()

    const { getContractById } = useContractContext();
    const { getBrandById } = useBrandContext();

    const client = streamClient
    const router = useMyNavigation();
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
            // await connectUser()
            const channels = await client.queryChannels({ cid });
            setChannel(channels[0]);

            if (channels[0]?.data?.contractId) {
                await fetchContract(channels[0]?.data?.contractId as string);
            }
        };

        if (isChatConnected && cid)
            fetchChannel();
    }, [cid, isChatConnected]);

    useEffect(() => {
        if (contract && user) {
            fetchBrand(contract?.brandId as string);
        }
    }, [contract, user]);

    if (!channel) {
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
        <View style={{ flex: 1 }}>
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
                    rightAction={true}
                    rightActionButton={
                        <>
                            {!!contract && <Pressable
                                style={{
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
                            </Pressable>}
                            {(channel?.data?.threadType == "influencer-invite") && <Pressable
                                style={{ paddingHorizontal: 16 }}
                                onPress={() => {
                                    router.push(`/review-influencer?${channel?.data?.influencerId == user?.id ? ("userId=" + channel?.data?.userId) : ("influencerId=" + channel?.data?.influencerId)}`);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    size={24}
                                    color={Colors(theme).gray100}
                                />
                            </Pressable>}
                        </>
                    }
                />
                {!!contract && <ChatMessageTopbar
                    contract={{
                        ...contract,
                        id: channel?.data?.contractId as string,
                    }}
                />}
                <MessageList />
                <MessageInput
                    AttachmentPickerSelectionBar={AttachmentPickerSelectionBar}
                />
            </Channel>
        </View>
    );
}

export default ChannelNative;
