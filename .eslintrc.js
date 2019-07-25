module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'vue/html-self-closing': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'no-console':'off',
  }
}
