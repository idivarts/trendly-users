import { Pressable, View } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/theme/useColorScheme";
import Colors from "@/constants/Colors";

const BackButton = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Pressable
      key={0}
      onPress={() => navigation.goBack()}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
        >
          {({ pressed }) => (
            <Ionicons
              name="arrow-back"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
              style={{ marginLeft: 14, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
};

export default BackButton;
