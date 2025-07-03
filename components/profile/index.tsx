import { useMyNavigation } from "@/shared-libs/utils/router";
import { FlatList } from "react-native";
import { View } from "../theme/Themed";
import ProfileItemCard from "./ProfileItemCard";

interface ProfileProps {
  items: any[];
}

const Profile: React.FC<ProfileProps> = ({
  items,
}) => {
  const router = useMyNavigation();

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ProfileItemCard
            item={item}
            onPress={() => router.push(item.route)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Profile;
