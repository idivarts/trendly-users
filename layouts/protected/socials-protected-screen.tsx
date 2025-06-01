import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { ActivityIndicator, Platform } from "react-native";

import CollaborationsShimmer from "@/components/shimmers/collaborations-shimmer";
import { View } from "@/components/theme/Themed";
import { useAuthContext, useSocialContext } from "@/contexts";
import Colors from "@/shared-uis/constants/Colors";

interface SocialsProtectedScreenProps extends PropsWithChildren { }

const SocialsProtectedScreen: React.FC<SocialsProtectedScreenProps> = ({
  children,
}) => {
  const {
    isUserLoading
  } = useAuthContext();
  const {
    isFetchingSocials,
  } = useSocialContext();

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (isUserLoading || isFetchingSocials) {
  //       signOutUser();
  //     }
  //   }, 10000); // wait 10 seconds before assuming something is wrong

  //   return () => clearTimeout(timeout);
  // }, [isUserLoading, isFetchingSocials]);

  // useEffect(() => {
  //   if (!isUserLoading && !isLoggedIn) {
  //     // Redirect to login page
  //     resetAndNavigate("/pre-signin");
  //   }
  // }, [isUserLoading])

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
