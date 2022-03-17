module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,

  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'class-methods-use-this': [0],
    'consistent-return': [0],
    'no-underscore-dangle': [0],
    'no-console': [0],
    'no-prototype-builtins': [0],
    'no-param-reassign': [0],
    'no-useless-return': [0],
    'max-len': [0],
    'no-return-await': [0],

  },
};
