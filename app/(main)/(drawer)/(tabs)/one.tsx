import { StyleSheet } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import Collaboration from "../../(screens)/collaboration";

const TabOneScreen = () => {
  return (
    <View style={styles.container}>
      <Collaboration />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default TabOneScreen;
