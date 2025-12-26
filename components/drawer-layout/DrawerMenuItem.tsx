import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { usePathname } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { useChatContext } from "@/contexts";
import { useInviteContext } from "@/contexts/use-invite";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { Badge } from "react-native-paper";
import { Text, View } from "../theme/Themed";

export interface IconPropFn {
    focused: boolean;
}

type Tab = {
    href: string;
    icon: IconProp | ((props: IconPropFn) => IconProp);
    label: string;
    showMessageCount?: boolean;
    showInviteCount?: boolean
};

type DrawerMenuItemProps = {
    tab: Tab;
};

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({ tab }) => {
    const router = useMyNavigation();
    const pathname = usePathname();
    const theme = useTheme();
    const { unreadCount } = useChatContext();
    const { brandCount, influencerCount } = useInviteContext()

    return (
        //@ts-ignore
        <Pressable onPress={() => router.push(tab.href)}>
            <View
                style={{
                    backgroundColor: tab.href.includes(pathname)
                        ? Colors(theme).primary
                        : Colors(theme).background,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: Colors(theme).aliceBlue,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderRadius: 12,
                }}
            >
                <FontAwesomeIcon
                    icon={
                        typeof tab.icon === "function"
                            ? tab.icon({ focused: tab.href.includes(pathname) })
                            : tab.icon
                    }
                    color={
                        tab.href.includes(pathname)
                            ? Colors(theme).white
                            : Colors(theme).text
                    }
                    size={28}
                />
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
                {tab.showMessageCount && unreadCount > 0 && (
                    <Badge
                        visible={true}
                        size={24}
                        selectionColor={Colors(theme).red}
                        style={{
                            backgroundColor: Colors(theme).red,
                        }}
                    >
                        {unreadCount}
                    </Badge>)}
                {tab.showInviteCount && (brandCount + influencerCount) > 0 && (
                    <Badge
                        visible={true}
                        size={24}
                        selectionColor={Colors(theme).red}
                        style={{
                            backgroundColor: Colors(theme).red,
                        }}
                    >
                        {(brandCount + influencerCount)}
                    </Badge>)}
            </View>
        </Pressable>
    );
};

export default DrawerMenuItem;
