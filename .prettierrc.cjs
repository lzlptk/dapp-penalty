module.exports = {
  semi: true,
  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  endOfLine: 'lf',
  printWidth: 120,
  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
  singleAttributePerLine: true,
};
