module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": [
      "warrning",
      {
        printWidth: 140,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: "as-needed",
        trailingComma: "all",
        bracketSpacing: true,
        arrowParens: "always",
        endOfLine: "auto",
      },
    ],
  },
};
