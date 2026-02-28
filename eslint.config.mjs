// @ts-check
import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,

  // Ignorar arquivos gerados/utilitários
  {
    ignores: ["components/ui/**", "clean.js", "restore_figma.js"],
  },

  // Regras TypeScript (apenas para arquivos .ts/.tsx)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Regras gerais (todos os arquivos)
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-duplicate-imports": "warn",
    },
  },
];

export default eslintConfig;
