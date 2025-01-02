import React from "react";
import { router, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useBreakpoints } from "@/hooks";
import { useTheme } from "@react-navigation/native";
import NotificationIcon from "@/components/notifications/notification-icon";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  faGear,
  faHandshake as faHandshakeSolid,
  faStar as faStarSolid,
  faUser as faUserSolid,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native";
import { useAuthContext } from "@/contexts";
import { COMPLETION_PERCENTAGE } from "@/constants/CompletionPercentage";
import { View } from "@/components/theme/Themed";

const TabLayout = () => {
  const { xl } = useBreakpoints();
  const theme = useTheme();
  const { user } = useAuthContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors(theme).primary,
        tabBarInactiveTintColor: Colors(theme).text,
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
            <FontAwesomeIcon
              color={color}
              icon={focused ? faCommentSolid : faComment}
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
        name="contracts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesomeIcon
              color={color}
              icon={focused ? faFileLinesSolid : faFileLines}
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
                      width: 15,
                      height: 15,
                      position: "absolute",
                      top: 5,
                      right: 20,
                      borderRadius: 40,
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
                icon={faGear}
                size={24}
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
