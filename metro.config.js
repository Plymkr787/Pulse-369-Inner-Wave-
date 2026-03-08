const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './src',
  '@components': './src/components',
  '@screens': './src/screens',
  '@hooks': './src/hooks',
  '@store': './src/store',
  '@utils': './src/utils',
  '@types': './src/types',
  '@services': './src/services',
  '@assets': './assets',
  '@constants': './src/constants',
};

module.exports = config;
