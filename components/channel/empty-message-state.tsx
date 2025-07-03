import { useMyNavigation } from "@/shared-libs/utils/router";
import { EmptyStateProps } from "stream-chat-expo";
import { View } from "../theme/Themed";
import EmptyState from "../ui/empty-state";

const EmptyMessageState: React.FC<EmptyStateProps> = ({ listType }) => {
  const router = useMyNavigation();
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
        subtitle={listType == "channel" ? "Start applying to collaborations to interact with your dream brands." : "Looks like you are on a break! Start applying today to collaborate with your dream brands."}
        title="No Messages"
      />
    </View>
  );
};

export default EmptyMessageState;
