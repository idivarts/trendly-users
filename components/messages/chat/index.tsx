import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import { Conversation } from "@/types/Groups";
import { useEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform } from "react-native";
import { ActivityIndicator, Appbar, Avatar, IconButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import ChatMessage from "./ChatMessage";
import { View } from "@/components/theme/Themed";
import styles from "@/styles/messages/Chat.styles";

interface ChatProps {
  conversation: Conversation;
}

const PAGE_SIZE = 15;

const Chat: React.FC<ChatProps> = ({ conversation }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(conversation.messages.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const { xl } = useBreakpoints();

  useEffect(() => {
    if (page === 1) {
      loadMessages(1);
    }
  }, []);

  const loadMessages = (nextPage: number) => {
    if (loading) return;
    setLoading(true);

    const newMessages = conversation.messages.slice(
      nextPage * PAGE_SIZE,
      nextPage * PAGE_SIZE + PAGE_SIZE
    );

    if (newMessages.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setPage(nextPage);
    }

    setLoading(false);
  };

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

    const newMessage = {
      id: Math.random().toString(),
      message,
      image: capturedImage,
      sender: "user" as const,
      time: new Date().toLocaleTimeString(),
    };

    setMessages([newMessage, ...messages]);
    setMessage("");
    setCapturedImage(null);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header statusBarHeight={0} style={styles.appbar}>
        <View style={[styles.backButtonContainer, { marginLeft: xl ? 10 : 0 }]}>
          <BackButton color={Colors.regular.platinum} />
        </View>
        <Avatar.Image source={{ uri: conversation.image }} size={48} />
        <Appbar.Content
          title={conversation.title}
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ChatMessage key={item.id} message={item} />}
          onEndReached={() => hasMore && !loading && loadMessages(page + 1)}
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
