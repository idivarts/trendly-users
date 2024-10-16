import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import { Groups } from "@/types/Groups";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform } from "react-native";
import { Appbar, Avatar, IconButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import ChatMessage from "./ChatMessage";
import { Text, View } from "@/components/theme/Themed";
import stylesFn from "@/styles/messages/Chat.styles";
import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";

import { useAuthContext, useFirebaseStorageContext, useGroupContext } from "@/contexts";
import { collection, doc, DocumentSnapshot, endBefore, onSnapshot, orderBy, query } from "firebase/firestore";
import { PLACEHOLDER_IMAGE } from "@/constants/Placeholder";
import { FirestoreDB } from "@/utils/firestore";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import DocumentUploadModal from "@/components/ui/modal/DocumentUploadModal";
import AssetPreview from "./AssetPreview";

export type ModalAsset = {
  url: string,
  type: "image" | "video",
};

interface ChatProps {
  group: Groups;
}

const Chat: React.FC<ChatProps> = ({ group }) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [message, setMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedDocument, setCapturedDocument] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [modalAsset, setModalAsset] = useState<ModalAsset | null>(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [processingText, setProcessingText] = useState("");

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

  const onImageUpload = (image: string) => {
    setCapturedImage(image);
  }

  const onVideoUpload = (video: string) => {
    setCapturedVideo(video);
  }

  const onDocumentUpload = (url: string) => {
    setCapturedDocument(url);
  }

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
    let attachments: {
      type: "image" | "video" | "file";
      url: string;
    }[] = [];

    if (capturedImage) {
      const uploadedImage = await uploadImage(
        capturedImage,
        `groups/${group.id}/images/${userType}-${senderId}-${timeStamp}`,
      );
      attachments.push({
        type: "image",
        url: uploadedImage,
      });
      setProcessingText("Uploading image...");
    }

    if (capturedDocument) {
      const uploadedDocument = await uploadImage(
        capturedDocument,
        `groups/${group.id}/documents/${userType}-${senderId}-${timeStamp}`,
      );
      attachments.push({
        type: "file",
        url: uploadedDocument,
      });
      setProcessingText("Uploading document...");
    }

    if (capturedVideo) {
      const uploadedVideo = await uploadImage(
        capturedVideo,
        `groups/${group.id}/videos/${userType}-${senderId}-${timeStamp}`,
      );
      attachments.push({
        type: "video",
        url: uploadedVideo,
      });
      setProcessingText("Uploading video...");
    }

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
    setProcessingText("");
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
        <ActivityIndicator size="large" color={Colors(theme).primary} />
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
              setModalAsset={setModalAsset}
              users={group.users}
            />
          )}
          onEndReached={() => hasNext && !loading && fetchNext30Messages()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator style={styles.loadingIndicator} /> : null}
          inverted
        />

        {
          processingText && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                gap: 10,
              }}
            >
              <ActivityIndicator
                color={Colors(theme).primary}
              />
              <Text>{processingText}</Text>
            </View>
          )
        }

        <AssetPreview
          capturedImage={capturedImage}
          capturedVideo={capturedVideo}
          capturedDocument={capturedDocument}
          setCapturedImage={setCapturedImage}
          setCapturedVideo={setCapturedVideo}
          setCapturedDocument={setCapturedDocument}
        />

        <View style={styles.inputContainer}>
          <IconButton
            icon="plus"
            onPress={() => setIsUploadModalVisible(true)}
          />
          <TextInput
            inputMode="text"
            style={styles.textInput}
            onChangeText={handleMessageChange}
            value={message}
            placeholder="Type a message"
            activeUnderlineColor={Colors(theme).aliceBlue}
            underlineColor={Colors(theme).aliceBlue}
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
            </>
          )}
        </View>
      </KeyboardAvoidingView>
      <DocumentUploadModal
        onDocumentUpload={onDocumentUpload}
        onImageUpload={onImageUpload}
        onVideoUpload={onVideoUpload}
        setVisible={setIsUploadModalVisible}
        visible={isUploadModalVisible}
      />
      {
        <Modal
          style={styles.assetModalStyle}
          visible={isModalVisible}
          animationType={Platform.OS === "web" ? "fade" : "slide"}
          transparent={true}
        >
          <View
            style={styles.assetModalContainer}
          >
            {
              modalAsset?.type === "video" ? (
                <Video
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                  ref={video}
                  style={styles.videoAsset}
                  videoStyle={styles.videoAssetStyle}
                  source={{
                    uri: modalAsset?.url ?? "",
                  }}
                  resizeMode={ResizeMode.COVER}
                  useNativeControls={true}
                />
              ) : (
                <Image
                  source={{
                    uri: modalAsset?.url ?? "",
                  }}
                  width={200}
                  height={200}
                  style={styles.assetModalAsset}
                />
              )
            }
            <IconButton
              icon="close"
              onPress={() => setIsModalVisible(false)}
              style={styles.assetModalCloseButton}
            />
          </View>
        </Modal>
      }
    </View>
  );
};

export default Chat;
