import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import { Groups } from "@/types/Groups";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform } from "react-native";
import { ActivityIndicator, Appbar, Avatar, IconButton, Modal, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import ChatMessage from "./ChatMessage";
import { View } from "@/components/theme/Themed";
import stylesFn from "@/styles/messages/Chat.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { useAuthContext, useGroupContext } from "@/contexts";
import { collection, doc, DocumentSnapshot, endBefore, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { PLACEHOLDER_IMAGE } from "@/constants/Placeholder";
import { useFirebaseStorageContext } from "@/contexts/firebase-storage-context.provider";
import { signInAnonymously } from "firebase/auth";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { useTheme } from "@react-navigation/native";

interface ChatProps {
  group: Groups;
}

const Chat: React.FC<ChatProps> = ({ group }) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [message, setMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [messages, setMessages] = useState([] as IMessages[]);
  const [endMessage, setEndMessage] = useState<DocumentSnapshot | null>(null);
  const [lastMessage, setLastMessage] = useState<DocumentSnapshot | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const {
    addMessageToGroup,
    fetchNextMessages,
    getMessagesByGroupId,
  } = useGroupContext();
  const {
    uploadImage,
  } = useFirebaseStorageContext();
  const {
    user,
  } = useAuthContext();

  const { xl } = useBreakpoints();

  const fetchFirst30Messages = async () => {
    setLoading(true);

    const response = await getMessagesByGroupId(
      group.id,
      30,
    );

    setEndMessage(response.firstMessage!);
    setHasNext(response.hasNext);
    setLastMessage(response.lastMessage);
    setMessages(response.messages);

    setLoading(false);
  }

  const fetchNext30Messages = async () => {
    if (lastMessage) {
      setLoading(true);

      const response = await fetchNextMessages(
        group.id,
        lastMessage,
        30,
      );
      const newMessages = response.messages;
      setHasNext(response.hasNext);
      setLastMessage(response.lastMessage);
      setMessages([...messages, ...newMessages]);

      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (endMessage && messages.length > 0) {
      const fetchRealtimeMessages = async (groupId: string) => {
        try {
          await signInAnonymously(AuthApp);
          const groupRef = doc(FirestoreDB, "groups", groupId);

          const messagesRef = collection(groupRef, "messages");
          const messagesQuery = query(messagesRef, orderBy("timeStamp", "desc"), endBefore(endMessage));

          unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
            const realtimeMessages = querySnapshot.docs.map((doc) => doc.data() as IMessages);

            setMessages([...realtimeMessages, ...messages]);
          });
        } catch (error) {
          console.error("Error fetching messages: ", error);
        }
      };

      fetchRealtimeMessages(group.id);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [endMessage]);

  useEffect(() => {
    if (group) {
      fetchFirst30Messages();
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
      cameraType: ImagePicker.CameraType.back,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !capturedImage) return;
    setIsSending(true);
    const senderId = user?.id || "";
    const timeStamp = new Date().getTime();
    const userType = "user";

    let uploadedImage: string | null = null;

    if (capturedImage) {
      uploadedImage = await uploadImage(
        capturedImage,
        `groups/${group.id}/${userType}-${senderId}-${timeStamp}`,
      );
    }

    const attachments = uploadedImage ? [{
      url: uploadedImage,
      type: "image" as "image",
    }] : [];

    const newMessage: IMessages = {
      attachments,
      groupId: group.id,
      message,
      userType,
      senderId,
      timeStamp,
    };

    await addMessageToGroup(group.id, newMessage);

    setMessages([newMessage, ...messages]);

    setIsSending(false);
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
          <BackButton color={Colors(theme).platinum} />
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
          keyExtractor={(item, index) => item.message?.toString() + index.toString() + item.timeStamp}
          renderItem={({ item, index }) => (
            <ChatMessage
              key={index + item.timeStamp}
              managers={group.managers}
              message={item}
              setIsModalVisible={setIsModalVisible}
              setModalImage={setModalImage}
              users={group.users}
            />
          )}
          onEndReached={() => hasNext && !loading && fetchNext30Messages()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator style={styles.loadingIndicator} /> : null}
          inverted
        />

        {capturedImage && (
          <View style={styles.capturedImageContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.capturedImage}
            />
            <IconButton
              style={styles.closeButton}
              icon="close"
              onPress={() => setCapturedImage(null)}
            />
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
            activeUnderlineColor={Colors(theme).primary}
            selectionColor={Colors(theme).primary}
          />
          {(message.length > 0 || capturedImage) ? (
            <IconButton
              disabled={isSending}
              icon="send"
              onPress={handleSend}
            />
          ) : (
            <>
              <IconButton
                disabled={isSending}
                icon="camera"
                onPress={openCamera}
              />
              <IconButton
                disabled={isSending}
                icon="microphone"
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
      {
        <Modal
          contentContainerStyle={styles.imageModalContainer}
          style={styles.imageModalStyle}
          visible={isModalVisible}
        >
          <View
            style={styles.imageModalImageContainer}
          >
            <IconButton
              icon="close"
              onPress={() => setIsModalVisible(false)}
              style={styles.imageModalCloseButton}
            />
            <Image
              source={{
                uri: modalImage ?? "",
              }}
              style={styles.imageModalImage}
            />
          </View>
        </Modal>
      }
    </View>
  );
};

export default Chat;
