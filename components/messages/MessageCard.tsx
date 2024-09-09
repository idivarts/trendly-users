import { Ionicons } from "@expo/vector-icons";
import { Text } from "../theme/Themed";
import { Avatar } from "react-native-paper";
import Colors from "@/constants/Colors";
import { Pressable, PressableProps, View } from "react-native";
import { Conversation } from "@/types/Conversation";
import styles from "@/styles/messages/MessageCard.styles";

interface MessageCardProps extends PressableProps {
  conversation: Conversation;
}

const MessageCard: React.FC<MessageCardProps> = ({
  conversation,
  ...props
}) => {
  const getLastMessage = () => {
    const totalMessages = conversation.messages.length;

    if (totalMessages === 0) {
      return null;
    }

    return conversation.messages[totalMessages - 1];
  }

  const lastMessage = getLastMessage();

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View style={[styles.container, { opacity: pressed ? 0.7 : 1 }]}>
          <Avatar.Image
            source={{ uri: conversation.image }}
            style={styles.avatarImage}
            size={54}
          />
          <View style={styles.contentContainer}>
            <View style={styles.textGroup}>
              <Text style={styles.titleText}>
                {conversation.title}
              </Text>
              {lastMessage && (
                <Text>
                  {lastMessage.message.length > 50 ? `${lastMessage.message.slice(0, 50)}...` : lastMessage.message}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.messageInfo}>
            {lastMessage && (
              <Text>
                {lastMessage.time}
              </Text>
            )}
            {conversation.newMessages !== 0 && (
              <Avatar.Text
                label={conversation.newMessages.toString()}
                size={18}
                style={styles.newMessagesAvatar}
              />
            )}
          </View>
          <View style={styles.chevronIcon}>
            <Ionicons name="chevron-forward" size={24} color={Colors.regular.primary} />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default MessageCard;
