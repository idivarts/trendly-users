import Messages from '@/components/messages';
import { CONVERSATIONS } from '@/constants/Conversations';
import { useRouter } from 'expo-router';

const MessagesScreen = () => {
  const router = useRouter();

  const changeConversation = (id: string) => {
    router.push(`/chat?id=${id}`);
  };

  return (
    <Messages
      changeConversation={changeConversation}
      conversations={CONVERSATIONS}
    />
  );
}

export default MessagesScreen;
