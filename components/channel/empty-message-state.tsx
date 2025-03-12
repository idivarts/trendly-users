import { useRouter } from "expo-router";
import { EmptyStateProps } from "stream-chat-expo";
import { View } from "../theme/Themed";
import EmptyState from "../ui/empty-state";

const EmptyMessageState: React.FC<EmptyStateProps> = ({ listType }) => {
  const router = useRouter();
  // if(listType =="channel"){

  // }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <EmptyState
        action={() => router.push("/collaborations")}
        actionLabel="Explore Collaborations"
        image={require("@/assets/images/illustration3.png")}
        subtitle={listType !== "channel" ? "Start applying to collaborations to interact with your dream brands." : "No chats here yet…"}
        title="No Messages"
      />
    </View>
  );
};

export default EmptyMessageState;
