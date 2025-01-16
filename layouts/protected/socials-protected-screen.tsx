import React, { PropsWithChildren } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";

import { View } from "@/components/theme/Themed";
import { useAuthContext, useSocialContext } from "@/contexts";
import Colors from "@/constants/Colors";
import CollaborationsShimmer from "@/components/shimmers/collaborations-shimmer";

interface SocialsProtectedScreenProps extends PropsWithChildren { }

const SocialsProtectedScreen: React.FC<SocialsProtectedScreenProps> = ({
  children,
}) => {

  const {
    isUserLoading,
  } = useAuthContext();
  const {
    isFetchingSocials,
  } = useSocialContext();

  if (isUserLoading || isFetchingSocials) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

const LoadingScreen: React.FC = () => {
  const theme = useTheme();

  if (Platform.OS === "web") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={Colors(theme).primary}
        />
      </View>
    );
  }

  return (
    <CollaborationsShimmer />
  );
}

export default SocialsProtectedScreen;
