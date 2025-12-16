const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind v4 configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('nativewind/metro/babel'),
};

module.exports = config;
