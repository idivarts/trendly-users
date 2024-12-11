import FacebookLoginButton from "@/components/profile/ConnectWithFacebook";
import SocialPage from "@/components/profile/SocialPage";
import { View } from "@/components/theme/Themed";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { AuthApp } from "@/utils/auth";
import { connectedAccounts } from "@/constants/CoonectedSocials";

const ConnectedSocials: React.FC = () => {
  const [socials, setSocials] = useState<any>();

  const fetchSocials = async () => {
    const userID = AuthApp.currentUser?.uid;
    if (!userID) {
      return;
    }
    const socialProfileRef = collection(
      FirestoreDB,
      "users",
      userID,
      "socials"
    );
    const socialProfileSnapshot = await getDocs(socialProfileRef);
    const socialProfileData = socialProfileSnapshot.docs.map((doc) =>
      doc.data()
    );
    setSocials(socialProfileData);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <FlatList
        data={connectedAccounts}
        renderItem={({ item }) => (
          <SocialPage
            handle={item.handle}
            name={item.name}
            platform={item.platform}
            primary={item.primary}
            image={item.image}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      />
      <FacebookLoginButton onFacebookLogin={() => {}} />
    </View>
  );
};

export default ConnectedSocials;
