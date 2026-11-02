module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@react-native-async-storage|react-native-svg|mathjs)/)',
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ].filter((p) => {
    try {
      require.resolve(p);
      return true;
    } catch {
      return false;
    }
  }),
};
