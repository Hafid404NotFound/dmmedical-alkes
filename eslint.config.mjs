const path = require("path");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  allConfig: {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = eslintConfig;
