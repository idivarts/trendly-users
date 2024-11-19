import { Pressable, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Href, usePathname, useRouter } from "expo-router";
import { APP_NAME } from "@/constants/App";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "../theme/Themed";
import {
  faHandshake,
  faComment,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import DrawerMenuItem from "./DrawerMenuItem";

interface DrawerMenuContentProps { }

const DRAWER_MENU_CONTENT_ITEMS = [
  {
    href: "/proposals",
    icon: faHandshake,
    label: "Proposals",
  },
  {
    href: "/messages",
    icon: faComment,
    label: "Messages",
  },
  {
    href: "/collaborations",
    icon: faStar,
    label: "Collaborations",
  },
  {
    href: "/contracts",
    icon: faFileSignature,
    label: "Contracts",
  },
  {
    href: "/profile",
    icon: faUser,
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
              <DrawerMenuItem
                key={index}
                tab={tab}
              />
            ))}
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerMenuContent;
