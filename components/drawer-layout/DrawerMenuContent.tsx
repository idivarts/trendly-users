import { DrawerContentScrollView } from "@react-navigation/drawer";
import { APP_NAME } from "@/constants/App";
import { Text, View } from "../theme/Themed";
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
  faHandshake as faHandshakeSolid,
  faStar as faStarSolid,
  faUser as faUserSolid,
} from "@fortawesome/free-solid-svg-icons";
import DrawerMenuItem, { IconPropFn } from "./DrawerMenuItem";

interface DrawerMenuContentProps { }

const DRAWER_MENU_CONTENT_ITEMS = [
  {
    href: "/proposals",
    icon: ({
      focused,
    }: IconPropFn) => focused ? faHandshakeSolid : faHandshake,
    label: "Proposals",
  },
  {
    href: "/messages",
    icon: ({
      focused,
    }: IconPropFn) => focused ? faCommentSolid : faComment,
    label: "Messages",
  },
  {
    href: "/collaborations",
    icon: ({
      focused,
    }: IconPropFn) => focused ? faStarSolid : faStar,
    label: "Collaborations",
  },
  {
    href: "/contracts",
    icon: ({
      focused,
    }: IconPropFn) => focused ? faFileLinesSolid : faFileLines,
    label: "Contracts",
  },
  {
    href: "/profile",
    icon: ({
      focused,
    }: IconPropFn) => focused ? faUserSolid : faUser,
    label: "Profile",
  },
];

const DrawerMenuContent: React.FC<DrawerMenuContentProps> = () => {
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
