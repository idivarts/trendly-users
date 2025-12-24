import FacebookLoginButton from "@/components/profile/ConnectWithFacebook";
import InstagramLoginButton from "@/components/profile/ConnectWithInstagramManual";
import SocialPage from "@/components/profile/SocialPage";
import { View } from "@/components/theme/Themed";
import { useSocialContext } from "@/contexts";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ConnectedSocials: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { socials } = useSocialContext();

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 20,
            }}
        >
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <FlatList
                        data={socials}
                        renderItem={({ item }) => (
                            // @ts-ignore
                            <SocialPage
                                handle={
                                    item.isInstagram ? item.instaProfile?.username || "" : ""
                                }
                                profile={item.isInstagram ? item.instaProfile : item.fbProfile}
                                platform={
                                    item.isInstagram
                                        ? SocialPlatform.INSTAGRAM
                                        : SocialPlatform.FACEBOOK
                                }
                                id={item.id}
                                image={item.image}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            flexGrow: 1,
                            gap: 10,
                        }}
                    />
                    <FacebookLoginButton />
                    <InstagramLoginButton />
                </>
            )}
        </View>
    );
};

export default ConnectedSocials;
