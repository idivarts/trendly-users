import { Theme } from "@react-navigation/native";


export const ColorsStatic = {
  primary: "rgb(5, 68, 99)",
  secondary: "rgb(83, 139, 166)",
  tintColorLight: "rgb(255, 109, 45)",
  tintColorDark: "rgb(255, 255, 255)",

  // Some Default colours
  aliceBlue: "rgb(233, 241, 247)",
  amber: "rgb(255, 191, 0)",
  unicornSilver: "rgb(232, 232, 232)",
  danger: "rgb(125, 82, 96)",
  eerieBlack: "rgb(27, 27, 27)",
  whiteSmoke: "rgb(245, 245, 245)",
  success: "rgb(2, 202, 48)",
  successForeground: "rgb(40, 167, 69)",
  gold: "rgb(236, 214, 148)",
  green: "rgb(157, 213, 134)",
  yellow: "rgb(232, 185, 49)",
  yellow100: "rgba(166, 159, 91, 0.839)",
  pink: "rgb(248, 215, 218)",
  pinkForeground: "rgb(220, 53, 69)",
  backdrop: "rgba(0, 0, 0, 0.5)",
  black: "rgb(0, 0, 0)",
  lightgray: "lightgray",
  orange: "#F64740",
  platinum: "rgb(219, 219, 219)",
  red: "red",
  gray100: "rgb(85, 85, 85)",
  gray200: "rgb(249, 249, 249)",
  gray300: "rgb(117, 117, 117)",
  surface: "rgb(255, 255, 255)",
  surfaceVariant: "rgb(255, 255, 255)",
  white: "rgb(255, 255, 255)",
  onPrimary: "rgb(255, 255, 255)",
  secondaryContainer: "rgb(83, 139, 166)",
  onSecondaryContainer: "rgb(255, 255, 255)",
  transparent: "transparent",
  notificationDot: "red",
}

export default (theme: Theme) => ({
  ...theme.colors,
  ...ColorsStatic,
  ...(theme.dark
    ? {
      primary: ColorsStatic.secondary,

      card: "rgb(30, 30, 30)",
      text: ColorsStatic.white,
      textSecondary: ColorsStatic.gray100,


      tint: ColorsStatic.tintColorDark,
      tabIconDefault: "rgb(204, 204, 204)",
      tabIconSelected: ColorsStatic.tintColorDark,
      onSurface: "rgb(83, 139, 166)",
      tag: "rgb(95, 99, 104)",
      tagForeground: "rgb(241, 243, 244)",
      outline: "rgb(83, 139, 166)",

      background: "rgb(0, 0, 0)",
      reverseBackground: "rgb(255, 255, 255)",
      cardBackground: "rgb(52, 52, 52)",
      modalBackground: "rgb(33, 33, 33)",
    }
    : {
      primary: ColorsStatic.primary,

      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      textSecondary: "rgb(102, 102, 102)",
      background: "rgb(255, 255, 255)",
      reverseBackground: "rgb(0, 0, 0)",
      tint: ColorsStatic.tintColorLight,
      tabIconDefault: "rgb(204, 204, 204)",
      tabIconSelected: ColorsStatic.tintColorLight,

      onSurface: "rgb(5, 68, 99)",
      tag: "rgb(241, 243, 244)",
      tagForeground: "rgb(95, 99, 104)",
      outline: "rgb(5, 68, 99)",
      cardBackground: "rgb(234, 234, 234)",
      modalBackground: "rgb(255, 255, 255)",
    }),
});
