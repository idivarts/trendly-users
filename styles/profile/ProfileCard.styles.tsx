import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderBottomColor: Colors.regular.aliceBlue,
    borderBottomWidth: 1,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.regular.primary,
  },
  textContainer: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
  },
});

export default styles;
