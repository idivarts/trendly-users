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
  white: "rgb(255, 255, 255)",
  secondaryContainer: "rgb(83, 139, 166)",
  onSecondaryContainer: "rgb(255, 255, 255)",
  transparent: "transparent",

  success: "rgb(2, 202, 48)",
  successForeground: "rgb(40, 167, 69)",
  cardDark: "rgb(30, 30, 30)",
  textLight: "rgb(0, 0, 0)",
  textSecondaryLight: "rgb(102, 102, 102)",
  tabIconDefault: "rgb(204, 204, 204)",
  onSurfaceDark: "rgb(83, 139, 166)",
  tagDark: "rgb(95, 99, 104)",
  tagForegroundDark: "rgb(241, 243, 244)",
  outlineDark: "rgb(83, 139, 166)",
  backgroundDark: "rgb(0, 0, 0)",
  modalBackgroundDark: "rgb(33, 33, 33)",
  tagLight: "rgb(241, 243, 244)",
  tagForegroundLight: "rgb(95, 99, 104)",
  outlineLight: "rgb(5, 68, 99)",
  modalBackgroundLight: "rgb(255, 255, 255)",
}

export default (theme: Theme) => ({
  ...theme.colors,
  ...ColorsStatic,
  ...(theme.dark
    ? {
      primary: ColorsStatic.secondary,

      card: ColorsStatic.cardDark,
      text: ColorsStatic.white,
      textSecondary: ColorsStatic.gray100,


      tint: ColorsStatic.tintColorDark,
      tabIconDefault: ColorsStatic.tabIconDefault,
      tabIconSelected: ColorsStatic.tintColorDark,
      onSurface: ColorsStatic.onSurfaceDark,
      tag: ColorsStatic.tagDark,
      tagForeground: ColorsStatic.tagForegroundDark,
      outline: ColorsStatic.outlineDark,

      background: ColorsStatic.backgroundDark,
      reverseBackground: ColorsStatic.white,
      modalBackground: ColorsStatic.modalBackgroundDark,
    }
    : {
      primary: ColorsStatic.primary,

      card: ColorsStatic.white,
      text: ColorsStatic.textLight,
      textSecondary: ColorsStatic.textSecondaryLight,

      tint: ColorsStatic.tintColorLight,
      tabIconDefault: ColorsStatic.tabIconDefault,
      tabIconSelected: ColorsStatic.tintColorLight,

      onSurface: ColorsStatic.outlineLight,
      tag: ColorsStatic.tagLight,
      tagForeground: ColorsStatic.tagForegroundLight,
      outline: ColorsStatic.outlineLight,

      background: ColorsStatic.white,
      reverseBackground: ColorsStatic.backgroundDark,
      modalBackground: ColorsStatic.modalBackgroundLight,
    }),
});
