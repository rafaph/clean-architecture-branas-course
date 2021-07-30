module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin", "sonarjs"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
  },
};
