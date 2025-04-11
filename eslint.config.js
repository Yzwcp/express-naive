import antfu from "@antfu/eslint-config";

export default antfu({
  unocss: true,
  formatters: true,
  stylistic: true,
  prettier: true,

  rules: {
    "n/prefer-global/process": "off",
    "no-undef": "error",
    "no-fallthrough": "off",
    "vue/block-order": "off",
    "@typescript-eslint/no-this-alias": "off",
    "prefer-promise-reject-errors": "off",
    "prettier/prettier": "error",
    "arrow-parens": "off",
    "bracket-spacing": "off",
    "jsx-quotes": "off",
    "quote-props": "off",
    "semi": "off",
    "single-quote": "off",
    "trailing-comma": "off",
  },
  languageOptions: {
    globals: {
      h: "readonly",
      unref: "readonly",
      provide: "readonly",
      inject: "readonly",
      markRaw: "readonly",
      defineAsyncComponent: "readonly",
      nextTick: "readonly",
      useRoute: "readonly",
      useRouter: "readonly",
      Message: "readonly",
      $loadingBar: "readonly",
      $message: "readonly",
      $dialog: "readonly",
      $notification: "readonly",
      $modal: "readonly",
    },
  },
});
