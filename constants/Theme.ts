import { Theme } from "@react-navigation/native";
import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";
import Colors from "./Colors";

const CustomPaperTheme = (theme: Theme) => ({
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    background: Colors(theme).background,
    onPrimary: Colors(theme).white,
    onSecondaryContainer: Colors(theme).onSecondaryContainer,
    onSurface: Colors(theme).onSurface,
    outline: Colors(theme).outline,
    primary: Colors(theme).primary,
    secondaryContainer: Colors(theme).secondaryContainer,
    surface: Colors(theme).white,
    surfaceVariant: Colors(theme).white,
    text: Colors(theme).text,
    elevation: {
      level1: Colors(theme).white,
    },
  },
});

export default CustomPaperTheme;
