import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
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
