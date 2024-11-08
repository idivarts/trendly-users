import { useRouter } from "expo-router";
import { View } from "../theme/Themed";
import ProfileItemCard from "./ProfileItemCard";
import { FlatList } from "react-native";

interface ProfileProps {
  items: any[];
}

const Profile: React.FC<ProfileProps> = ({
  items,
}) => {
  const router = useRouter();

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
