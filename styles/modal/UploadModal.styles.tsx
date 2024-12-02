import Colors from "@/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const styles = (theme: Theme) => StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: Colors(theme).transparent,
    gap: 12,
  },
  uploadContainer: {
    backgroundColor: Colors(theme).aliceBlue,
    height: 200,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: Colors(theme).modalBackground,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadInnerContainer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors(theme).transparent,
  },
  modalButton: {
    backgroundColor: Colors(theme).lightgray,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
});

export default styles;
