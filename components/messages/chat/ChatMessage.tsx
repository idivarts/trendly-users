import { Image } from "react-native";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { Message } from "@/types/Conversation";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <View
      key={message.id}
      style={{
        flexDirection: "row",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          gap: 5,
          maxWidth: "80%",
        }}
      >
        <View
          style={{
            backgroundColor: message.sender === "user" ? Colors.regular.primary : Colors.regular.platinum,
            borderRadius: 10,
            padding: 10,
            position: "relative",
            gap: 10,
          }}
        >
          {message.image && (
            <Image
              source={{ uri: message.image }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
              }}
            />
          )}
          {message.message && (
            <Text style={{ color: message.sender === "user" ? "white" : "black" }}>
              {message.message}
            </Text>
          )}
        </View>
        {
          message.time && (
            <Text
              style={{
                marginLeft: message.sender === "user" ? 0 : 5,
                marginRight: message.sender === "user" ? 5 : 0,
                textAlign: message.sender === "user" ? "right" : "left",
                fontSize: 10,
              }}
            >
              {message.time}
            </Text>
          )
        }
      </View>
    </View>
  );
};

export default ChatMessage;
