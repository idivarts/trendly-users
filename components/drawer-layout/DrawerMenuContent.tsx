import { Pressable, StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Href, usePathname, useRouter } from "expo-router";
import { APP_NAME } from "@/constants/App";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";

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
  const theme = useTheme();

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
              <Pressable key={index} onPress={() => router.push(tab.href as Href)}>
                <View
                  style={{
                    backgroundColor: tab.href.includes(pathname)
                      ? Colors(theme).primary
                      : Colors(theme).background,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: Colors(theme).aliceBlue,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                  }}
                >
                  <Text
                    style={{
                      color: tab.href.includes(pathname)
                        ? Colors(theme).white
                        : Colors(theme).text,
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
