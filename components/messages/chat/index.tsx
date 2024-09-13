import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import { Groups } from "@/types/Groups";
import { useEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform } from "react-native";
import { ActivityIndicator, Appbar, Avatar, IconButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import ChatMessage from "./ChatMessage";
import { View } from "@/components/theme/Themed";
import styles from "@/styles/messages/Chat.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { useGroupContext } from "@/contexts";
import { DocumentSnapshot } from "firebase/firestore";
import { PLACEHOLDER_IMAGE } from "@/constants/PlaceholderImage";

interface ChatProps {
  group: Groups;
}

const Chat: React.FC<ChatProps> = ({ group }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([] as IMessages[]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<DocumentSnapshot | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const {
    getMessagesByGroupId,
  } = useGroupContext();

  const { xl } = useBreakpoints();

  const fetchMessages = async () => {
    if (loading) return;
    setLoading(true);

    let response;

    if (lastMessage) {
      response = await getMessagesByGroupId(group.id, lastMessage);
    } else {
      response = await getMessagesByGroupId(group.id, null);
    };

    const newMessages = response.messages;
    setHasNext(response.hasNext);
    setLastMessage(response.lastMessage);
    setMessages([...messages, ...newMessages]);

    setLoading(false);
  };

  useEffect(() => {
    if (group) {
      fetchMessages();
    }
  }, []);

  const handleMessageChange = (text: string) => setMessage(text);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('We need camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleSend = () => {
    if (!message.trim() && !capturedImage) return;

    const newMessage: IMessages = {
      attachments: [{
        url: capturedImage as string,
        type: "image",
      }],
      groupId: group.id,
      message,
      userType: "user",
      senderId: "user-id",
      timeStamp: new Date().getMilliseconds(),
    };

    setMessages([...messages, newMessage]);

    // TODO: Create new message in real time and add it to the messages

    setMessage("");
    setCapturedImage(null);
  };

  if (messages.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header statusBarHeight={0} style={styles.appbar}>
        <View style={[styles.backButtonContainer, { marginLeft: xl ? 10 : 0 }]}>
          <BackButton color={Colors.regular.platinum} />
        </View>
        <Avatar.Image
          source={{
            uri: group.image || PLACEHOLDER_IMAGE,
          }}
          size={48}
        />
        <Appbar.Content
          title={group.name}
          style={styles.appbarContent}
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <FlatList
          data={messages}
          style={styles.flex}
          contentContainerStyle={styles.messageListContainer}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <ChatMessage key={index} message={item} />}
          onEndReached={() => hasNext && !loading && fetchMessages()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator style={styles.loadingIndicator} /> : null}
          inverted
        />

        {capturedImage && (
          <View style={styles.capturedImageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <IconButton icon="plus" />
          <TextInput
            inputMode="text"
            style={styles.textInput}
            onChangeText={handleMessageChange}
            value={message}
            placeholder="Type a message"
            activeUnderlineColor={Colors.regular.primary}
            selectionColor={Colors.regular.primary}
          />
          {(message.length > 0 || capturedImage) ? (
            <IconButton icon="send" onPress={handleSend} />
          ) : (
            <>
              <IconButton icon="camera" onPress={openCamera} />
              <IconButton icon="microphone" />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;
