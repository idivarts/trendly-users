import EditProfile from "@/components/basic-profile/edit-profile";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";

const EditProfileScreen: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Edit Profile"
      />
      <EditProfile />
    </View>
  );
};

export default EditProfileScreen;
