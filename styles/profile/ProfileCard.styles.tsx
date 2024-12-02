import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomColor: Colors(theme).aliceBlue,
    borderBottomWidth: 1,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors(theme).primary,
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
