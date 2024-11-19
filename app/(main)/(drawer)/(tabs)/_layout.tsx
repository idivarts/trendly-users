import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useBreakpoints } from "@/hooks";
import { useTheme } from "@react-navigation/native";
import NotificationIcon from "@/components/notifications/notification-icon";
import { FontAwesome6 } from "@expo/vector-icons";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome6>["name"];
  color: string;
}) => {
  return (
    <FontAwesome6
      size={28}
      style={{
        marginBottom: -3,
      }}
      {...props}
    />
  );
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
        tabBarShowLabel: !xl,
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
          title: "Proposals",
          tabBarLabel: "Proposals",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="handshake-simple" color={color} />
          ),
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarLabel: "Messages",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comment" color={color} />
          ),
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="collaborations"
        options={{
          title: "Collaborations",
          tabBarLabel: "Collaborations",
          headerRight: () => <NotificationIcon />,
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />
      <Tabs.Screen
        name="contracts"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-signature" color={color} />
          ),
          title: "Contracts",
          tabBarLabel: "Contracts",
          headerTitleAlign: "left",
          headerRight: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
