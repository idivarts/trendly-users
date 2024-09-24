import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/messages/ChatMessage.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Alert, Image, Pressable } from "react-native";
import { useAuthContext } from "@/contexts";
import { useTheme } from "@react-navigation/native";
import * as Linking from 'expo-linking';

interface ChatMessageProps {
  managers: {
    [key: string]: any,
  };
  message: IMessages;
  users: {
    [key: string]: any,
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  managers,
  message,
  users,
}) => {
  const {
    user,
  } = useAuthContext();
  const isSender = message.senderId === user?.id;
  const isUser = message.userType === "user";
  const theme = useTheme();
  const styles = stylesFn(theme);

  const openImage = async (url: string) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error('Error opening image: ', error);
        Alert.alert('Error', 'Failed to open the image.');
      }
    }
  };

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
            { backgroundColor: isSender ? Colors(theme).primary : Colors(theme).platinum },
          ]}
        >
          {
            message.attachments
            && message.attachments.length > 0
            && message.attachments?.map((attachment) => {
              if (
                attachment.type === "image"
                && attachment.url
              ) {
                return (
                  <Pressable
                    onPress={() => {
                      openImage(attachment.url);
                    }}
                  >
                    <Image
                      key={attachment.url}
                      source={{ uri: attachment.url }}
                      style={styles.messageImage}
                    />
                  </Pressable>
                );
              }
            })
          }
          {message.message && (
            <Text
              style={[
                styles.messageText,
                {
                  color: isSender ? Colors(theme).white : Colors(theme).black,
                  textAlign: isSender ? "right" : "left",
                }
              ]}
            >
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
