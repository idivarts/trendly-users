import {
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuthContext } from "./auth-context.provider";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

export const ChatProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);

  const {
    user,
  } = useAuthContext();

  useEffect(() => {
    const connect = async () => {
      await client.connectUser(
        {
          id: user?.id as string,
          name: user?.name as string,
          image: user?.profileImage as string || '',
        },
        client.devToken(user?.id as string),
      ).then(() => {
        setIsReady(true);
      });
    }

    connect();

    return () => {
      if (isReady && client) {
        client.disconnectUser();
        setIsReady(false);
      }
    };
  }, [user?.id]);

  return (
    <OverlayProvider>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};
