const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  // SVG support (keep)
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/expo"
    ),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  /**
   * WEB ALIASES
   * NOTE:
   * - @10play/* packages are unstable with Expo 54
   * - expo-crypto should NOT be manually aliased
   */
  const webAliases = {
    // "react-native": "react-native-web",

    // ⚠️ Temporarily disabled due to Expo 54 conflicts
    // "react-native-webview": "@10play/react-native-web-webview",
    // "react-native/Libraries/Utilities/codegenNativeComponent":
    //   "@10play/react-native-web-webview/shim",

    // DO NOT alias crypto – Expo handles this internally
    // crypto: "expo-crypto",
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