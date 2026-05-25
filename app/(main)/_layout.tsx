import { AWSContextProvider, BrandContextProvider, ChatContextProvider, CollaborationContextProvider, ContractContextProvider, NotificationContextProvider, SocialContextProvider, useAuthContext } from "@/contexts";
import { useSocialContext } from "@/contexts/social-context.provider";
import { streamClient } from "@/contexts/chat-context.provider";
import { InviteContextProvider } from "@/contexts/use-invite";
import { CloudMessagingContextProvider } from "@/shared-libs/contexts/cloud-messaging.provider";
import { ScrollProvider } from "@/shared-libs/contexts/scroll-context";
import TrackingProvider from "@/shared-libs/contexts/tracking-provider";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Linking, Platform } from "react-native";

// Handles the trendly-creators://social-connected deep link returned by connect.trendly.now
// Sits inside SocialContextProvider so it can access refreshSocials and primarySocial.
const SocialConnectHandler: React.FC = () => {
    const { refreshSocials, primarySocial } = useSocialContext();
    const { resetAndNavigate } = useMyNavigation();

    const handleURL = (url: string) => {
        try {
            const parsed = new URL(url);
            const path = parsed.pathname || parsed.hostname; // deep links: hostname is the path
            if (!path.includes("social-connected")) return;

            const status = parsed.searchParams.get("status");
            const platform = parsed.searchParams.get("platform") || "social";
            const message = parsed.searchParams.get("message");

            if (status === "success") {
                Toaster.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
                refreshSocials();
                if (!primarySocial) {
                    resetAndNavigate("/primary-social-select");
                }
            } else {
                Toaster.error(message || `Failed to connect ${platform}. Please try again.`);
            }
        } catch {
            // ignore malformed URLs
        }
    };

    useEffect(() => {
        if (Platform.OS === "web") {
            // On web, connect.trendly.now redirects back to the web app URL
            const url = window.location.href;
            if (url.includes("social-connected")) {
                handleURL(url);
            }
            return;
        }

        // Native: listen for incoming deep links
        const subscription = Linking.addEventListener("url", ({ url }) => {
            handleURL(url);
        });

        // Also handle the case where the app was opened cold from a deep link
        Linking.getInitialURL().then((url) => {
            if (url) handleURL(url);
        });

        return () => subscription.remove();
    }, [primarySocial]);

    return null;
};

const MainLayout = () => {
    const { user, updateUser } = useAuthContext()
    return (
        <TrackingProvider>
            <SocialContextProvider>
                <AWSContextProvider>
                    <BrandContextProvider>
                        <CollaborationContextProvider>
                            <ContractContextProvider>
                                <NotificationContextProvider>
                                    <CloudMessagingContextProvider streamClient={streamClient} userOrmanager={user} updateUserOrManager={updateUser}>
                                        <ChatContextProvider>
                                            <ScrollProvider>
                                                <InviteContextProvider>
                                                    <SocialConnectHandler />
                                                    <Stack
                                                        screenOptions={{
                                                            headerShown: false,
                                                        }}
                                                    />
                                                </InviteContextProvider>
                                            </ScrollProvider>
                                        </ChatContextProvider>
                                    </CloudMessagingContextProvider>
                                </NotificationContextProvider>
                            </ContractContextProvider>
                        </CollaborationContextProvider>
                    </BrandContextProvider>
                </AWSContextProvider>
            </SocialContextProvider>
        </TrackingProvider>
    );
};

export default MainLayout;
