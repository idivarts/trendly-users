import { Text, View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import {
    faChevronRight,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Dimensions, Pressable } from "react-native";
import { List } from "react-native-paper";

interface ContentItemProps {
    content: any;
    empty?: boolean;
    leftIcon?: any;
    attachments?: any[];
    onAction?: () => void;
    onRemove?: (id: string) => void;
    title: string;
    rightContent?: boolean;
    small?: boolean
}

const ListItem: React.FC<ContentItemProps> = ({
    content,
    empty,
    onAction,
    leftIcon,
    title,
    attachments,
    onRemove,
    rightContent = false,
    small
}) => {
    const theme = useTheme();

    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 0.3,
                borderColor: Colors(theme).gray300,
                paddingVertical: 16,
            }}
            onPress={onAction}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={leftIcon}
                            size={small ? 16 : 20}
                            color={Colors(theme).text}
                        />
                        <Text
                            style={{
                                fontSize: small ? 16 : 20,
                                minWidth: Dimensions.get("window").width / 3,
                                maxWidth: Dimensions.get("window").width * 0.7,
                            }}
                        >
                            {title}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                        }}
                    >
                        {rightContent ? (typeof content == "string" ?
                            <Text
                                style={{
                                    color: Colors(theme).textSecondary,
                                    fontSize: small ? 14 : 18,
                                    paddingVertical: 6,
                                }}
                            >
                                {content}
                            </Text> : content
                        ) : null}
                        <FontAwesomeIcon
                            icon={empty ? faPlus : faChevronRight}
                            size={18}
                            color={Colors(theme).text}
                        />
                    </View>
                </View>
                {!rightContent && content && (
                    <Text
                        style={{
                            color: Colors(theme).gray300,
                            fontSize: 18,
                        }}
                    >
                        {/* {content} */}
                        <List.Item
                            title={content}
                            style={{
                                paddingHorizontal: 0,
                                paddingVertical: 0,
                                marginVertical: 0,
                            }}
                            titleStyle={{
                                fontSize: small ? 16 : 18,
                                color: Colors(theme).textSecondary,
                            }}
                        />
                    </Text>
                )}
                {attachments && attachments.length > 0 ? (
                    <List.Section>
                        {attachments.map((attachment) => (
                            <List.Item
                                key={attachment.id}
                                title={attachment.id || attachment.name}
                                description={attachment.type}
                                style={{
                                    marginVertical: 0,
                                }}
                                left={(props) => <List.Icon {...props} icon="file" />}
                                right={(props) => (
                                    //@ts-ignore
                                    <Pressable onPress={() => onRemove(attachment.id)}>
                                        <List.Icon
                                            {...props}
                                            icon={() => <FontAwesomeIcon icon={faTrash} size={16} />}
                                        />
                                    </Pressable>
                                )}
                            />
                        ))}
                    </List.Section>
                ) : null}
            </View>
        </Pressable>
    );
};

export default ListItem;
