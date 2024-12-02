import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 0,
  }
});

export default styles;
