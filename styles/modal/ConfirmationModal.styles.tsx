import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

const stylesFn = (theme: Theme) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors(theme).backdrop,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors(theme).background,
    borderRadius: 16,
    padding: 25,
    // alignItems: "center",
    shadowColor: Colors(theme).backdrop,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    ...(Platform.OS === "web" && { maxWidth: 500 })
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "left",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 10,
  },
  button: {
    backgroundColor: Colors(theme).primary,
  },
  buttonSecondary: {
    backgroundColor: Colors(theme).background,
    borderColor: Colors(theme).border,
    borderWidth: 2
  },
  secondaryText: {
    color: Colors(theme).primary,
  }
});

export default stylesFn;
