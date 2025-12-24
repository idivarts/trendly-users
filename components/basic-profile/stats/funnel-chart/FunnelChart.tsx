import { Platform } from "react-native";

const Component = Platform.select({
    native: () => require("./FunnelChart.native"),
    default: () => require("./FunnelChart.web"),
})();

export default Component;
