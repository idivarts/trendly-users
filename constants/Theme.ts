import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";
import Colors from "./Colors";
import { Theme } from "@react-navigation/native";

const CustomPaperTheme = (theme: Theme) => ({
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: Colors(theme).primary,
    background: Colors(theme).background,
    text: Colors(theme).text,
    surface: Colors(theme).surface,
    onSurface: Colors(theme).onSurface,
    surfaceVariant: Colors(theme).surfaceVariant,
    elevation: {
      level1: Colors(theme).white,
    },
  },
});

export default CustomPaperTheme;
