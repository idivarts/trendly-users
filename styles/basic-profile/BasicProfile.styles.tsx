import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarSection: {
    alignItems: "center",
    borderBottomColor: Colors.regular.aliceBlue,
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
    color: Colors.regular.primary,
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
    backgroundColor: Colors.regular.primary,
  },
});

export default styles;
