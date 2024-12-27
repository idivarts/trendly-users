import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import {
  faChevronRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Dimensions, Pressable } from "react-native";
import { IconButton, List } from "react-native-paper";

interface ContentItemProps {
  content: string;
  empty?: boolean;
  leftIcon?: any;
  attachments?: any[];
  onAction?: () => void;
  onRemove?: (id: string) => void;
  title: string;
}

const ListItem: React.FC<ContentItemProps> = ({
  content,
  empty,
  onAction,
  leftIcon,
  title,
  attachments,
  onRemove,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0.3,
        paddingVertical: content ? 0 : 16,
      }}
      onPress={onAction}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: empty ? 6 : -6,
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
              size={20}
              color={Colors(theme).text}
            />
            <Text
              style={{
                fontSize: 20,
              }}
            >
              {title}
            </Text>
          </View>

          <FontAwesomeIcon
            icon={empty ? faPlus : faChevronRight}
            size={18}
            color={Colors(theme).text}
          />
        </View>
        {content && (
          <Text
            style={{
              color: Colors(theme).text,
              fontSize: 18,
              paddingVertical: 6,
            }}
          >
            {content}
          </Text>
        )}
        {attachments && attachments.length > 0 && (
          <List.Section>
            {attachments.map((attachment) => (
              <List.Item
                key={attachment.id}
                title={attachment.id || attachment.name}
                description={attachment.type}
                style={{
                  paddingHorizontal: 0,
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
        )}
      </View>
    </Pressable>
  );
};

export default ListItem;
