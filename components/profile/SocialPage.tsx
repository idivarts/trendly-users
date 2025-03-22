import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useAuthContext } from "@/contexts";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import ImageComponent from "@/shared-uis/components/image-component";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { stylesFn } from "@/styles/profile/SocialPage.styles";
import { FirestoreDB } from "@/utils/firestore";
import { HttpWrapper } from "@/utils/http-wrapper";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Linking } from "react-native";
import { IconButton, Menu } from "react-native-paper";

interface SocialPageProps {
  name: string;
  handle: string;
  platform: SocialPlatform;
  image: string;
  profile: any;
  id: string;
}

const SocialPage: React.FC<SocialPageProps> = ({
  name,
  handle,
  platform,
  id,
  image,
  profile,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const { user } = useAuthContext();

  const handleExpandEvents = (page: any) => {
    if (page.userName) {
      Linking.openURL("https://www.instagram.com/" + page.userName);
    }
  };

  const makePrimary = async () => {
    const userId = user?.id;
    if (!userId) return;

    const userDocRef = doc(FirestoreDB, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data() as IUsers;

    userData.primarySocial = id;

    await updateDoc(userDocRef, { primarySocial: userData.primarySocial })
      .then(() => {
        HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST" });
        Toaster.success("Social marked as primary");
      })
      .catch((error) => {
        Toaster.error("Error marking social as primary");
      });
  };

  return (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <ImageComponent
          url={image}
          altText="Profile Photo"
          shape="square"
          size="small"
        />
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={styles.title}>{profile.name}</Text>
          {handle && (
            <Text style={styles.underline}>{handle ? "@" + handle : null}</Text>
          )}
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors(theme).primary,
          padding: 5,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon
          icon={
            platform === SocialPlatform.INSTAGRAM ? faInstagram : faFacebook
          }
          size={20}
          color={Colors(theme).white}
        />
      </View>
      {user?.primarySocial === id && (
        <View
          style={{
            backgroundColor: Colors(theme).primary,
            padding: 5,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 10,
          }}
        >
          <FontAwesomeIcon
            icon={faStar}
            size={20}
            color={Colors(theme).white}
          />
          <Text
            style={{
              color: Colors(theme).white,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Primary
          </Text>
        </View>
      )}
      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={
          <IconButton
            icon="dots-horizontal"
            onPress={toggleMenu}
            style={styles.iconButton}
          />
        }
        contentStyle={{
          marginTop: 40,
          backgroundColor: Colors(theme).background,
          borderWidth: 0.5,
          borderColor: Colors(theme).aliceBlue,
        }}
      >
        <>
          <Menu.Item
            onPress={() => {
              makePrimary();
            }}
            title="Mark as Primary"
            style={styles.menuStyle}
            titleStyle={styles.menuTitleStyle}
          />
          <Menu.Item
            onPress={() => { }}
            title="Disconnect"
            style={styles.menuStyle}
            titleStyle={styles.menuTitleStyle}
          />
        </>
      </Menu>
    </View>
  );
};

export default SocialPage;
