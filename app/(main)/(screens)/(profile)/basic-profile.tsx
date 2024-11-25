import BasicProfile from "@/components/basic-profile";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";

const BasicProfileScreen = () => {
  const {
    user,
  } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Profile"
      />
      <BasicProfile
        user={user}
      />
    </View>
  );
};

export default BasicProfileScreen;
