import { Text } from "@/components/theme/Themed";
import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import { Conversation } from "@/types/Conversation";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { Appbar, Avatar, IconButton, TextInput } from "react-native-paper";

interface ChatProps {
  conversation: Conversation;
}

const Chat: React.FC<ChatProps> = ({
  conversation,
}) => {
  const { xl } = useBreakpoints();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header
        statusBarHeight={0}
        style={{
          paddingVertical: 10,
          gap: 10,
          backgroundColor: Colors.regular.primary,
        }}
      >
        <View
          style={{
            marginLeft: xl ? 10 : 0,
          }}
        >
          <BackButton color={Colors.regular.platinum} />
        </View>
        <Avatar.Image
          source={{ uri: conversation.image }}
          size={48}
        />
        <Appbar.Content
          title={conversation.title}
          style={{
            alignItems: "flex-start",
          }}
          titleStyle={{
            fontSize: 16,
            textAlign: "left",
            fontWeight: "bold",
            color: "white",
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          gap: 10,
          padding: 10,
        }}
      >
        {
          conversation.messages.map((message: any) => (
            <View
              key={message.id}
              style={{
                flexDirection: "row",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <View
                style={{
                  maxWidth: "80%",
                  backgroundColor: message.sender === "user" ? Colors.regular.primary : Colors.regular.platinum,
                  borderRadius: 10,
                  padding: 10,
                  position: "relative",
                }}
              >
                <Text
                  style={{
                    color: message.sender === "user" ? "white" : "black",
                  }}
                >
                  {message.message}
                </Text>
                <FontAwesome
                  name="comment"
                  size={16}
                  color={message.sender === "user" ? Colors.regular.primary : Colors.regular.platinum}
                  style={{
                    position: "absolute",
                    transform: [
                      {
                        rotateY: message.sender === "user" ? "180deg" : "0deg",
                      },
                    ],
                    bottom: 0,
                    right: message.sender === "user" ? 0 : 10,
                    left: message.sender === "user" ? 8 : 0,
                  }}
                />
              </View>
            </View>
          ))
        }
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.regular.platinum
        }}
      >
        <IconButton
          icon="plus"
        />
        <TextInput
          style={{
            flex: 1,
            backgroundColor: Colors.regular.platinum,
          }}
          placeholder="Type a message"
        />
        <IconButton
          icon="send"
        />
      </View>
    </View>
  );
};

export default Chat;
