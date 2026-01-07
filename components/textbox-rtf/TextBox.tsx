import { Platform } from "react-native";

const Component = Platform.select({
    native: () => require("./TextBox.native"),
    default: () => require("./TextBox.web"),
})();

export default Component;
