import { Ionicons } from "@expo/vector-icons";
import { Text } from "../theme/Themed";
import { Avatar } from "react-native-paper";
import Colors from "@/constants/Colors";
import { Pressable, PressableProps, View } from "react-native";
import { Groups } from "@/types/Groups";
import stylesFn from "@/styles/messages/MessageCard.styles";
import { PLACEHOLDER_IMAGE } from "@/constants/Placeholder";
import { useTheme } from "@react-navigation/native";

interface MessageCardProps extends PressableProps {
  group: Groups;
}

const MessageCard: React.FC<MessageCardProps> = ({
  group,
  ...props
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View style={[styles.container, { opacity: pressed ? 0.7 : 1 }]}>
          <Avatar.Image
            source={{
              uri: group.image || PLACEHOLDER_IMAGE,
            }}
            style={styles.avatarImage}
            size={54}
          />
          <View style={styles.contentContainer}>
            <View style={styles.textGroup}>
              <Text style={styles.titleText}>
                {group.name}
              </Text>
              {group?.latestMessage && group?.latestMessage?.message && (
                <Text>
                  {group.latestMessage.message.length > 50 ? `${group.latestMessage.message.slice(0, 50)}...` : group.latestMessage.message}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.messageInfo}>
            {group?.latestMessage && (
              <Text>
                {new Date(group?.latestMessage?.timeStamp).toLocaleTimeString()}
              </Text>
            )}
            {/* {group.newMessages !== 0 && (
              <Avatar.Text
                label={group.newMessages.toString()}
                size={18}
                style={styles.newMessagesAvatar}
              />
            )} */}
          </View>
          <View style={styles.chevronIcon}>
            <Ionicons name="chevron-forward" size={24} color={Colors(theme).primary} />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default MessageCard;
