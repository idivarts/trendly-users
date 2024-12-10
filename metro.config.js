const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  const webAliases = {
    "react-native": "react-native-web",
    "react-native-webview": "@10play/react-native-web-webview",
    "react-native/Libraries/Utilities/codegenNativeComponent":
      "@10play/react-native-web-webview/shim",
    crypto: "expo-crypto",
  };

  config.resolver.resolveRequest = (
    context,
    realModuleName,
    platform,
    moduleName
  ) => {
    if (platform === "web") {
      const alias = webAliases[realModuleName];
      if (alias) {
        return {
          filePath: require.resolve(alias),
          type: "sourceFile",
        };
      }
    }
    return context.resolveRequest(
      context,
      realModuleName,
      platform,
      moduleName
    );
  };

  return config;
})();
