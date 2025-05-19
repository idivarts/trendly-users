import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";

const Index = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ marginBottom: 20 }}>Welcome to Trendly</Text>
      <ActivityIndicator
        size="large"
        color={Colors(theme).primary}
      />
    </View>
  );
};

export default Index;
