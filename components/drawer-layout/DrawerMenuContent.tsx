import { Pressable, StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { APP_NAME } from "@/constants/App";
import { useColorScheme } from "../theme/useColorScheme";
import Colors from "@/constants/Colors";

interface DrawerMenuContentProps { }

const DRAWER_MENU_CONTENT_ITEMS = [
  {
    href: "/proposals",
    label: "Proposals",
  },
  {
    href: "/messages",
    label: "Messages",
  },
  {
    href: "/collaborations",
    label: "Collaborations",
  },
  {
    href: "/contracts",
    label: "Contracts",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

const DrawerMenuContent: React.FC<DrawerMenuContentProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <DrawerContentScrollView>
        <View
          style={{
            flex: 1,
            gap: 6,
          }}
        >
          <View>
            <Text
              style={{
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: 16,
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {APP_NAME}
            </Text>
          </View>
          <View>
            {DRAWER_MENU_CONTENT_ITEMS.map((tab, index) => (
              <Pressable key={index} onPress={() => router.push(tab.href)}>
                <View
                  style={{
                    backgroundColor: tab.href.includes(pathname)
                      ? Colors.regular.primary
                      : Colors[colorScheme].background,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: Colors.regular.aliceBlue,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                  }}
                >
                  <Text
                    style={{
                      color: tab.href.includes(pathname)
                        ? Colors.regular.white
                        : Colors[colorScheme].text,
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerMenuContent;
