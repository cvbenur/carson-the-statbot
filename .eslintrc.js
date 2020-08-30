module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  rules: {
    'linebreak-style': ['off', 'unix'],
    'class-methods-use-this': 'off',
    'prefer-default-export': 'off',
  },
};
