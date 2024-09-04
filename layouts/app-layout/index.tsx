import { PropsWithChildren, useMemo } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/theme/useColorScheme";
import { useThemeColor } from "@/components/theme/Themed";

interface AppLayoutProps extends PropsWithChildren<Record<string, unknown>> { }

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isAndroid = useMemo(() => Platform.OS === "android", []);
  const lightColor = useMemo(() => Colors.light.background, []);
  const darkColor = useMemo(() => Colors.dark.background, []);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: isAndroid ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      {children}
      <ExpoStatusBar style={colorScheme === "light" ? "dark" : "light"} />
    </SafeAreaView>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
