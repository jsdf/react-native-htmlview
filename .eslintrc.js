module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jasmine: true,
  },
  globals: {
    jest: true,
    shallowRender: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'prettier'],
  rules: {
    'no-console': 0,
    'no-shadow': 2,
    'no-var': 2,
    'react/prop-types': 0,
    'prettier/prettier': 'error',
  },
};
