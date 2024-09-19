import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import styles from "@/styles/messages/ChatMessage.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Image } from "react-native";

interface ChatMessageProps {
  message: IMessages;
  users: {
    [key: string]: any,
  };
  managers: {
    [key: string]: any,
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  users,
  managers,
}) => {
  // TODO: Get user id from auth context
  const isSender = message.senderId === "IjOAHWjc3d8ff8u6Z2rD";
  const isUser = message.userType === "user";

  return (
    <View
      style={[styles.container, { justifyContent: isSender ? "flex-end" : "flex-start" }]}
    >
      <View style={styles.messageContainer}>
        {
          !isSender && (
            <View>
              <Text
                style={styles.messageSenderName}
              >
                {
                  isUser ? users[message.senderId].name : managers[message.senderId].name
                }
              </Text>
            </View>
          )
        }
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: isSender ? Colors.regular.primary : Colors.regular.platinum },
          ]}
        >
          {message.attachments && message.attachments.length > 0 && message.attachments?.map((attachment) => {
            if (attachment.type === "image") {
              return (
                <Image
                  key={attachment.url}
                  source={{ uri: attachment.url }}
                  style={{ width: 200, height: 200 }}
                />
              );
            }
          })}
          {message.message && (
            <Text style={{ color: isSender ? "white" : "black" }}>
              {message.message}
            </Text>
          )}
        </View>
        {message.timeStamp && (
          <Text
            style={[
              styles.messageTime,
              {
                marginLeft: isSender ? 0 : 5,
                marginRight: isSender ? 5 : 0,
                textAlign: isSender ? "right" : "left",
              },
            ]}
          >
            {new Date(message.timeStamp).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;
