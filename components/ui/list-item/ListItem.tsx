import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  title: string;
}

const ListItem: React.FC<ContentItemProps> = ({
  content,
  empty,
  onAction,
  leftIcon,
  title,
  attachments,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0.3,
        paddingBottom: 12,
      }}
      onPress={onAction}
    >
      <View
        style={{
          flex: 1,
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
          {empty ? (
            <View
              style={{
                backgroundColor: Colors(theme).yellow,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 50,
              }}
            >
              <Text
                style={{
                  color: Colors(theme).black,
                  fontSize: 12,
                }}
              >
                Add now
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: Colors(theme).background,
              }}
            >
              <IconButton
                icon={() => (
                  <FontAwesomeIcon
                    icon={empty ? faPlus : faChevronRight}
                    size={18}
                    color={Colors(theme).text}
                  />
                )}
              />
            </View>
          )}
        </View>
        {content && (
          <Text
            style={{
              color: Colors(theme).text,
              fontSize: 16,
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
                title={attachment.id}
                description={attachment.type}
                left={(props) => <List.Icon {...props} icon="file" />}
              />
            ))}
          </List.Section>
        )}
      </View>
    </Pressable>
  );
};

export default ListItem;
