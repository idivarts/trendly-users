import { StyleSheet } from "react-native";
import { Theme } from "@react-navigation/native";
import { MARGIN, SIZE } from "@/utils/drag-component";
import Colors from "@/constants/Colors";

export const draggableGridStylesFn = (
  theme: Theme,
) => StyleSheet.create({
  container: {
    width: SIZE - MARGIN,
    height: SIZE - MARGIN,
    margin: MARGIN,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors(theme).white,
    backgroundColor: Colors(theme).platinum,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: SIZE - MARGIN - 8,
    height: SIZE - MARGIN - 8,
    borderRadius: 100,
  },
  video: {
    width: SIZE - MARGIN - 8,
    height: SIZE - MARGIN - 8,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors(theme).red,
  },
  addButton: {
    borderRadius: 100,
    borderWidth: 2,
    padding: 5,
    borderColor: Colors(theme).white,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 100,
    borderWidth: 2,
    padding: 5,
    backgroundColor: Colors(theme).primary,
    borderColor: Colors(theme).primary,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors(theme).black,
  },
});

export const gridStylesFn = (
  theme: Theme,
) => StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    backgroundColor: Colors(theme).platinum,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  hintText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors(theme).white,
    borderStyle: 'dashed',
  },
});
