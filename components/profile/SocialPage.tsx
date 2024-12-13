import React, { useEffect, useState } from "react";
import { Linking, Image } from "react-native";
import {
  Card,
  IconButton,
  Menu,
  ActivityIndicator,
  Avatar,
} from "react-native-paper";
import { stylesFn } from "@/styles/profile/SocialPage.styles";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { SocialPlatform } from "@/shared-libs/firestore/trendly-pro/constants/social-platform";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

interface SocialPageProps {
  name: string;
  handle: string;
  platform: SocialPlatform;
  primary: boolean;
  image: string;
  profile: any;
}

const SocialPage: React.FC<SocialPageProps> = ({
  name,
  handle,
  platform,
  primary,
  image,
  profile,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleExpandEvents = (page: any) => {
    if (page.userName) {
      Linking.openURL("https://www.instagram.com/" + page.userName);
    }
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Image
              source={{
                uri: image,
              }}
              width={50}
              height={50}
            />
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text style={styles.title}>{profile.name}</Text>
              {handle && (
                <Text style={styles.underline}>
                  {handle ? "@" + handle : null}
                </Text>
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
          {primary && (
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
                onPress={() => {}}
                title="Mark as Primary"
                style={styles.menuStyle}
                titleStyle={styles.menuTitleStyle}
              />
              <Menu.Item
                onPress={() => {}}
                title="Disconnect"
                style={styles.menuStyle}
                titleStyle={styles.menuTitleStyle}
              />
            </>
          </Menu>
        </View>
      </Card>
    </>
  );
};

export default SocialPage;
