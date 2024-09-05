import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";
import Colors from "./Colors";

const CustomPaperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: Colors.regular.primary,
    background: Colors.regular.background,
    text: Colors.regular.text,
    surface: Colors.regular.surface,
    onSurface: Colors.regular.onSurface,
    surfaceVariant: Colors.regular.surfaceVariant,
    elevation: {
      level1: Colors.regular.white,
    },
  },
};

export default CustomPaperTheme;
