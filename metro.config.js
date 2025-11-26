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
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    crypto: require.resolve('expo-crypto'), // optional polyfill, see below
  };

  const webAliases = {
    "react-native": "react-native-web",
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
    } else {
      if (moduleName === 'axios') {
        return {
          type: 'sourceFile',
          filePath: require.resolve('axios/dist/axios.js'),
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
