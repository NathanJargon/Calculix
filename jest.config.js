module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|mathjs)/)',
  ],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'].filter(
    (p) => {
      try {
        require.resolve(p);
        return true;
      } catch {
        return false;
      }
    }
  ),
};
