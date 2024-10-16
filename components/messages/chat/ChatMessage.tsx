import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/messages/ChatMessage.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { useAuthContext } from "@/contexts";
import { useTheme } from "@react-navigation/native";
import { ModalAsset } from ".";
import MessageAssetPreview from "./MessageAssetPreview";
import { DUMMY_USER_ID } from "@/constants/User";

interface ChatMessageProps {
  managers: {
    [key: string]: any,
  };
  message: IMessages;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalAsset: React.Dispatch<React.SetStateAction<ModalAsset | null>>;
  users: {
    [key: string]: any,
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  managers,
  message,
  setIsModalVisible,
  setModalAsset,
  users,
}) => {
  const {
    user,
  } = useAuthContext();
  // const isSender = message.senderId === user?.id;
  const isSender = message.senderId === DUMMY_USER_ID;
  const isUser = message.userType === "user";
  const theme = useTheme();
  const styles = stylesFn(theme);

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
          <MessageAssetPreview
            attachments={message.attachments}
            isSender={isSender}
            setIsModalVisible={setIsModalVisible}
            setModalAsset={setModalAsset}
          />
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
            {new Date(message.timeStamp).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
              }
            )}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;
