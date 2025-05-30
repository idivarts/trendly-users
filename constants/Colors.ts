import { Theme } from "@react-navigation/native";


export const ColorsStatic = {
  primary: "rgb(5, 68, 99)",
  secondary: "rgb(83, 139, 166)",

  // Some Default colours
  aliceBlue: "rgb(233, 241, 247)",
  eerieBlack: "rgb(27, 27, 27)",
  gold: "rgb(236, 214, 148)",
  green: "rgb(157, 213, 134)",
  yellow: "rgb(232, 185, 49)",
  yellow100: "rgba(166, 159, 91, 0.839)",
  black: "rgb(0, 0, 0)",
  lightgray: "lightgray",
  red: "red",
  gray100: "rgb(85, 85, 85)",
  gray200: "rgb(249, 249, 249)",
  gray300: "rgb(117, 117, 117)",
  white: "rgb(255, 255, 255)",
  transparent: "transparent",

  backdrop: "rgba(0, 0, 0, 0.5)",
  backdropDark: "rgba(255, 255, 255, 0.5)",
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
      primary: ColorsStatic.secondary, // Main accent color
      card: ColorsStatic.eerieBlack, // Card background color
      text: ColorsStatic.white, // Primary text color
      textSecondary: ColorsStatic.gray300, // Secondary text, captions
      tint: ColorsStatic.secondary, // Tint for icons/buttons
      tabIconDefault: ColorsStatic.gray300, // Inactive tab icons
      tabIconSelected: ColorsStatic.secondary, // Active tab icons
      onSurface: ColorsStatic.gray300, // Surface overlay color
      tag: ColorsStatic.gray100, // Tag background
      tagForeground: ColorsStatic.white, // Tag text/icon color
      outline: ColorsStatic.gray300, // Borders and outlines
      background: ColorsStatic.black, // App background
      reverseBackground: ColorsStatic.white, // Opposite of background for contrast
      modalBackground: ColorsStatic.eerieBlack, // Modal or overlay background

      backdrop: ColorsStatic.backdropDark, // Backdrop color for modals
    }
    : {
      primary: ColorsStatic.primary, // Main accent color
      card: ColorsStatic.white, // Card background color
      text: ColorsStatic.black, // Primary text color
      textSecondary: ColorsStatic.gray100, // Secondary text, captions
      tint: ColorsStatic.primary, // Tint for icons/buttons
      tabIconDefault: ColorsStatic.gray300, // Inactive tab icons
      tabIconSelected: ColorsStatic.primary, // Active tab icons
      onSurface: ColorsStatic.gray300, // Surface overlay color
      tag: ColorsStatic.gray200, // Tag background
      tagForeground: ColorsStatic.black, // Tag text/icon color
      outline: ColorsStatic.gray300, // Borders and outlines
      background: ColorsStatic.white, // App background
      reverseBackground: ColorsStatic.black, // Opposite of background for contrast
      modalBackground: ColorsStatic.white, // Modal or overlay background

      backdrop: ColorsStatic.backdrop, // Backdrop color for modals
    }),
});
