import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { Portal } from "react-native-paper";
// import WebView from "react-native-webview";

const HelpAndSupportScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  return (
    <AppLayout style={{ flex: 1 }}>
      <ScreenHeader title="Help and Support" />
      {Platform.OS !== "web" && (
        <>
          {loading && (
            <Portal>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors(theme).backdrop,
                }}
              >
                <ActivityIndicator size="large" color={Colors(theme).text} />
              </View>
            </Portal>
          )}
          {/* <WebView
            onLoad={() => {
              setLoading(false);
            }}
            source={{ uri: "https://trendly.now/help-and-support/" }}
            style={{
              flex: 1,
            }}
          /> */}
        </>
      )}
    </AppLayout>
  );
};

export default HelpAndSupportScreen;
