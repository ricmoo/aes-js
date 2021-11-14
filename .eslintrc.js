module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": ["jest"],
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
  ],
  "rules": {
    "curly": "warn",
    "no-var": "warn",
    "camelcase": "warn",
    "semi": "warn",
    "no-use-before-define": "warn",
    "eqeqeq": "warn",
    "no-alert": "error",
    "no-unused-vars": "error",
    "no-undef": "error",
  },
};
