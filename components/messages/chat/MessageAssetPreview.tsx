import { Text, View } from "@/components/theme/Themed";
import stylesFn from "@/styles/messages/ChatMessage.styles";
import { useRef } from "react";
import { Alert, Image, Pressable } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useTheme } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { ModalAsset } from ".";
import Colors from "@/constants/Colors";

interface MessageAssetPreviewProps {
  attachments?: {
    type: "image" | "video" | "file",
    url: string,
  }[];
  isSender: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalAsset: React.Dispatch<React.SetStateAction<ModalAsset | null>>;
}

const MessageAssetPreview: React.FC<MessageAssetPreviewProps> = ({
  attachments,
  isSender,
  setIsModalVisible,
  setModalAsset,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const video = useRef(null);

  const openAsset = async (url: string) => {
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
    <View>
      {
        attachments
        && attachments.length > 0
        && attachments?.map((attachment) => {
          if (
            attachment.type === "image"
            && attachment.url
          ) {
            return (
              <Pressable
                onPress={() => {
                  setModalAsset({
                    url: attachment.url,
                    type: "image",
                  });
                  setIsModalVisible(true);
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

          if (
            attachment.type === "video"
            && attachment.url
          ) {
            return (
              <Pressable
                onPress={() => {
                  setModalAsset({
                    url: attachment.url,
                    type: "video",
                  });
                  setIsModalVisible(true);
                }}
              >
                <Video
                  ref={video}
                  style={styles.messageVideo}
                  source={{
                    uri: attachment?.url,
                  }}
                  videoStyle={styles.messageVideoStyle}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls={false}
                  shouldPlay={false}
                />
              </Pressable>
            );
          }

          if (
            attachment.type === "file"
            && attachment.url
          ) {
            return (
              <Pressable
                onPress={() => {
                  openAsset(attachment.url);
                }}
              >
                <View
                  style={[
                    styles.messageDoc,
                    {
                      backgroundColor: isSender ? Colors(theme).primary : Colors(theme).platinum,
                    }
                  ]}
                >
                  <Text
                    key={attachment.url}
                    style={[
                      styles.messageDocText,
                      {
                        color: isSender ? Colors(theme).white : Colors(theme).black,
                        textAlign: isSender ? "right" : "left",
                      }
                    ]}
                  >
                    Document
                  </Text>
                </View>
              </Pressable>
            );
          }
        })
      }
    </View>
  );
};

export default MessageAssetPreview;
