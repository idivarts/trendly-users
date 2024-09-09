import { Image } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { Message } from "@/types/Conversation";
import styles from "@/styles/messages/ChatMessage.styles";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserMessage = message.sender === "user";

  return (
    <View
      key={message.id}
      style={[styles.container, { justifyContent: isUserMessage ? "flex-end" : "flex-start" }]}
    >
      <View style={styles.messageContainer}>
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: isUserMessage ? Colors.regular.primary : Colors.regular.platinum },
          ]}
        >
          {message.image && (
            <Image
              source={{ uri: message.image }}
              style={styles.messageImage}
            />
          )}
          {message.message && (
            <Text style={{ color: isUserMessage ? "white" : "black" }}>
              {message.message}
            </Text>
          )}
        </View>
        {message.time && (
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
            {message.time}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;
