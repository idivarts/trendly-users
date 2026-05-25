import SocialPage from "@/components/profile/SocialPage";
import Button from "@/components/ui/button";
import { View } from "@/components/theme/Themed";
import { useSocialContext } from "@/contexts";
import { useConnectSocial } from "@/hooks/requests";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ConnectedSocials: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { socials } = useSocialContext();
    const { connectSocial } = useConnectSocial();

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
                            <SocialPage
                                handle={item.username}
                                profile={{ name: item.displayName }}
                                platform={
                                    item.platform === "instagram"
                                        ? SocialPlatform.INSTAGRAM
                                        : SocialPlatform.FACEBOOK
                                }
                                id={item.id}
                                image={item.profileImageURL}
                                name={item.displayName}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            flexGrow: 1,
                            gap: 10,
                        }}
                    />
                    <Button
                        mode="contained"
                        style={{ marginVertical: 10, paddingVertical: 5 }}
                        onPress={() => connectSocial()}
                        icon="link"
                        labelStyle={{ color: "white", fontSize: 16 }}
                    >
                        Add Account
                    </Button>
                </>
            )}
        </View>
    );
};

export default ConnectedSocials;
