import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { ActivityIndicator, Platform } from "react-native";

import CollaborationsShimmer from "@/components/shimmers/collaborations-shimmer";
import { View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useAuthContext, useSocialContext } from "@/contexts";

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


  return <>
    {(isUserLoading || isFetchingSocials) && <LoadingScreen />}
    {
      <View style={{ display: (isUserLoading || isFetchingSocials) ? "none" : "flex", flex: 1 }}>
        {children}
      </View>
    }
  </>;
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
