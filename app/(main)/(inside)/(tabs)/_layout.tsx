import { Tabs } from "expo-router";
import React from "react";

import NotificationIcon from "@/components/notifications/notification-icon";
import { View } from "@/components/theme/Themed";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { useAuthContext, useChatContext } from "@/contexts";
import { useInviteContext } from "@/contexts/use-invite";
import { useBreakpoints } from "@/hooks";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import {
    faComment,
    faFileLines,
    faHandshake,
    faStar,
    faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
    faComment as faCommentSolid,
    faFileLines as faFileLinesSolid,
    faGears,
    faHandshake as faHandshakeSolid,
    faStar as faStarSolid,
    faUser as faUserSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Badge } from "react-native-paper";

import GlassTabBar from "@/shared-uis/components/glass/GlassTabBar";
import GlassTabScreenHeader from "@/shared-uis/components/glass/GlassTabScreenHeader";

const TabLayout = () => {
    const { xl } = useBreakpoints();
    const theme = useTheme();
    const { user } = useAuthContext();
    const { unreadCount } = useChatContext();
    const { brandCount, influencerCount } = useInviteContext()
    const router = useMyNavigation();

    return (
        <Tabs
            tabBar={(props) => (xl ? null : <GlassTabBar {...props} />)}
            screenOptions={{
                tabBarActiveTintColor: Colors(theme).primary,
                tabBarInactiveTintColor: Colors(theme).text,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
                header: (headerProps) => <GlassTabScreenHeader {...headerProps} />,
                headerTransparent: useClientOnlyValue(false, true),
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: Colors(theme).transparent,
                },
                tabBarShowLabel: !xl,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    display: xl ? "none" : "flex",
                    position: "absolute",
                    height: 0,
                    minHeight: 0,
                    backgroundColor: Colors(theme).transparent,
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
        >
            <Tabs.Screen
                name="collaborations"
                options={{
                    title: "Brand Collaborations",
                    tabBarLabel: "Brands",
                    headerRight: () => <NotificationIcon />,
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesomeIcon
                            color={color}
                            icon={focused ? faStarSolid : faStar}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="influencers"
                options={{
                    title: "Creators Collaborations",
                    tabBarLabel: "Influencers",
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesomeIcon
                            color={color}
                            icon={focused ? faHandshakeSolid : faHandshake}
                            size={28}
                        />
                    ),
                    headerRight: () => <NotificationIcon />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    tabBarLabel: "Messages",
                    tabBarIcon: ({ color, focused }) => (
                        <>
                            <FontAwesomeIcon
                                color={color}
                                icon={focused ? faCommentSolid : faComment}
                                size={24}
                            />
                            {(unreadCount > 0) && (
                                <Badge
                                    visible={true}
                                    size={20}
                                    selectionColor={Colors(theme).red}
                                    style={{
                                        backgroundColor: Colors(theme).red,
                                        zIndex: 1,
                                        position: "absolute",
                                        top: 0,
                                        right: 20,
                                    }}
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </>
                    ),
                    headerRight: () => <NotificationIcon />,
                }}
            />
            <Tabs.Screen
                name="invites"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <>
                            <FontAwesomeIcon
                                color={color}
                                icon={focused ? faFileLinesSolid : faFileLines}
                                size={24}
                            />
                            {((brandCount + influencerCount) > 0) && (
                                <Badge
                                    visible={true}
                                    size={20}
                                    selectionColor={Colors(theme).red}
                                    style={{
                                        backgroundColor: Colors(theme).red,
                                        zIndex: 1,
                                        position: "absolute",
                                        top: 0,
                                        right: 12,
                                    }}
                                >
                                    {(brandCount + influencerCount)}
                                </Badge>
                            )}
                        </>
                    ),
                    title: "Invites",
                    tabBarLabel: "Invites",
                    headerTitleAlign: "left",
                    headerRight: () => <NotificationIcon />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <>
                            <FontAwesomeIcon
                                color={color}
                                icon={focused ? faUserSolid : faUser}
                                size={24}
                            />
                            {(!user?.profile?.completionPercentage ||
                                user.profile.completionPercentage < COMPLETION_PERCENTAGE) && (
                                    <View
                                        style={{
                                            backgroundColor: Colors(theme).yellow,
                                            width: 10,
                                            height: 10,
                                            position: "absolute",
                                            top: 5,
                                            right: 20,
                                            borderRadius: 20,
                                        }}
                                    />
                                )}
                        </>
                    ),

                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                paddingRight: 20,
                            }}
                            onPress={() => {
                                router.push("/settings");
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faGears}
                                size={32}
                                color={Colors(theme).text}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
