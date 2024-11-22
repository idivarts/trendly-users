import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useBreakpoints } from "@/hooks";
import { useTheme } from "@react-navigation/native";
import NotificationIcon from "@/components/notifications/notification-icon";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHandshake,
  faComment,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

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
            <FontAwesomeIcon
              color={color}
              icon={faHandshake}
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
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              color={color}
              icon={faComment}
              size={24}
            />
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
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              color={color}
              icon={faStar}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contracts"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              color={color}
              icon={faFileSignature}
              size={24}
            />
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
            <FontAwesomeIcon
              color={color}
              icon={faUser}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
