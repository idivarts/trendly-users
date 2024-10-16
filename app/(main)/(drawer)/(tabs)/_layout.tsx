import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useBreakpoints } from "@/hooks";
import { useTheme } from "@react-navigation/native";
import NotificationIcon from "@/components/notifications/notification-icon";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) => {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
};

const TabLayout = () => {
  const { xl } = useBreakpoints();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors(theme).primary,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: xl,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: xl ? "none" : "flex", // Hide the tab bar on desktop screens
        },
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="proposals"
        options={{
          title: "Applications",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="handshake-o" color={color} />
          ),
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comments" color={color} />
          ),
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="collaborations"
        options={{
          title: "Collaborations",
          headerRight: () => <NotificationIcon />,
          tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="contracts"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text-o" color={color} />
          ),
          title: "Contracts",
          headerTitleAlign: "left",
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user-circle-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
