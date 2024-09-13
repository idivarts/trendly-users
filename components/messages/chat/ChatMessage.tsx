import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import styles from "@/styles/messages/ChatMessage.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";

interface ChatMessageProps {
  message: IMessages;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // TODO: Match userId with senderId
  const isUserMessage = message.userType === "user";

  return (
    <View
      style={[styles.container, { justifyContent: isUserMessage ? "flex-end" : "flex-start" }]}
    >
      <View style={styles.messageContainer}>
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: isUserMessage ? Colors.regular.primary : Colors.regular.platinum },
          ]}
        >
          {/* {message.attachments && (
            <Image
              source={{ uri: message.image }}
              style={styles.messageImage}
            />
          )} */}
          {message.message && (
            <Text style={{ color: isUserMessage ? "white" : "black" }}>
              {message.message}
            </Text>
          )}
        </View>
        {message.timeStamp && (
          <Text
            style={[
              styles.messageTime,
              {
                marginLeft: isUserMessage ? 0 : 5,
                marginRight: isUserMessage ? 5 : 0,
                textAlign: isUserMessage ? "right" : "left",
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
