import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarSection: {
    alignItems: "center",
    borderBottomColor: Colors(theme).aliceBlue,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 20,
  },
  avatarContainer: {
    alignItems: "center",
  },
  editButton: {
    color: Colors(theme).primary,
    fontSize: 14,
    marginTop: 5,
  },
  textInputContainer: {
    gap: 20,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  saveButton: {
    borderRadius: 4,
    backgroundColor: Colors(theme).primary,
  },
});

export default styles;
