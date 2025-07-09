import { Theme, useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import { CREATORS_PLAYSTORE_URL } from "@/shared-constants/app";
import { Console } from "@/shared-libs/utils/console";
import BottomSheetContainer from "@/shared-uis/components/bottom-sheet";
import Colors, { ColorsStatic } from "@/shared-uis/constants/Colors";
import { usePathname } from "expo-router";
import { Image, Linking, StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";

interface DownloadPlayModalProps { }

const DownloadPlayModal: React.FC<DownloadPlayModalProps> = ({ }) => {
  const snapPoints = useMemo(() => ["35%", "35%"], []);

  const theme = useTheme();
  const styles = stylesFn(theme);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthContext()
  const [displayedOnce, setDisplayedOnce] = useState(false)

  const pathname = usePathname()

  const openUrl = async () => {
    const url = `trendly-creators:/${pathname}`
    Console.log("Opening URL", url)
    const canOpen = await Linking.canOpenURL(url)
    Console.log("Can Open URL ", canOpen)
    if (canOpen) {
      const mWindow = window.open(url, "_parent");
      if (mWindow) {
        setTimeout(() => {
          if (mWindow && !mWindow.closed) {
            mWindow.close();
          }
        }, 5000);
      }
    }
  }

  useEffect(() => {
    if (!user || !user.primarySocial || displayedOnce)
      return

    setDisplayedOnce(true)
    setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    openUrl()
  }, [user])

  const {
    lg,
  } = useBreakpoints();

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <BottomSheetContainer
      snapPoints={snapPoints}
      isVisible={isVisible}
      onClose={handleClose}>
      <View
        style={styles.container}
      >
        <View style={styles.header}>
          <Image source={require('@/assets/images/icon.png')} style={{ width: 40, height: 40, borderColor: ColorsStatic.primary, borderWidth: 2, borderRadius: 20 }} />
          <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 16, gap: 8 }}>
            <Text style={styles.headerTitle}>
              Unofficial Android App!
            </Text>
            <Text style={styles.headerText}>
              Download the app for the best experience. This is an APK file and not from the Play Store.
            </Text>
            <Text style={styles.headerText}>
              During installation, you might see a warning that the app is from an unknown developer. Please accept and continue.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <Text
                onPress={() => {
                  window.open(CREATORS_PLAYSTORE_URL, "_blank");
                }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: ColorsStatic.primary,
                  color: "#fff",
                  borderRadius: 6,
                  overflow: "hidden",
                  fontWeight: "500",
                }}
              >
                Download App
              </Text>
              <Text
                onPress={handleClose}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: "#ccc",
                  color: "#000",
                  borderRadius: 6,
                  overflow: "hidden",
                  fontWeight: "500",
                }}
              >
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BottomSheetContainer>
  );
};

export default DownloadPlayModal;

const stylesFn = (theme: Theme) => StyleSheet.create({
  bottomSheetScrollViewContentContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 50,
  },
  container: {
    justifyContent: "space-between",
    marginHorizontal: 16,
    flex: 1,
  },
  header: {
    alignItems: "flex-start",
    backgroundColor: Colors(theme).transparent,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 18,
    color: Colors(theme).text,
    fontWeight: "600",
    textAlign: "left",
  },
  headerText: {
    fontSize: 14,
    color: Colors(theme).text,
    textAlign: "left",
  },
});
