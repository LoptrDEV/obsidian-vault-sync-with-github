import json from "@eslint/json";
import globals from "globals";
import obsidianmd from "eslint-plugin-obsidianmd";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

const obsidianRecommended = obsidianmd.configs.recommended
  .filter((config) => {
    if (!Array.isArray(config.files) || config.files.length !== 1) {
      return true;
    }
    return config.files[0] !== "package.json";
  })
  .map((config) => {
    const hasObsidianRules = Object.keys(config.rules ?? {}).some((ruleName) =>
      ruleName.startsWith("obsidianmd/")
    );
    if (!config.files && hasObsidianRules) {
      return {
        ...config,
        files: ["src/**/*.ts", "tests/**/*.ts"],
      };
    }
    return config;
  });

const restrictedRuntimeSyntax = [
  {
    selector: "MemberExpression[property.name='innerHTML']",
    message: "Do not write raw HTML into the DOM. Use Obsidian/DOM APIs that set text safely.",
  },
  {
    selector: "MemberExpression[property.name='outerHTML']",
    message: "Do not replace DOM with raw HTML in runtime code.",
  },
  {
    selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
    message: "Do not inject unsanitized HTML into the DOM.",
  },
  {
    selector: "NewExpression[callee.name='Function']",
    message: "Do not construct functions dynamically in runtime code.",
  },
];

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    plugins: {
      json,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        requestUrl: "readonly",
        Buffer: "readonly",
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js", "manifest.json", "vitest.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".json"],
      },
    },
  },
  ...obsidianRecommended,
  {
    files: ["**/*.json"],
    language: "json/json",
    rules: json.configs.recommended.rules,
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.ts", "tests/**/*.ts"],
  })),
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/only-throw-error": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
  {
    files: ["**/*.json", "scripts/**/*.mjs", "eslint.config.js"],
    rules: {
      "obsidianmd/no-plugin-as-component": "off",
    },
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-console": "error",
      "no-restricted-syntax": ["error", ...restrictedRuntimeSyntax],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["src/utils/runtime-log.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["src/core/conflict-action-runner.ts", "src/core/sync-engine.ts"],
    rules: {
      // `FileManager.trashFile()` would require minAppVersion 1.6.6.
      "obsidianmd/prefer-file-manager-trash-file": "off",
    },
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "obsidianmd/prefer-active-doc": "off",
      "obsidianmd/prefer-active-window-timers": "off",
    },
  },
  {
    files: ["scripts/**/*.mjs", "eslint.config.js", "vitest.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "import/no-nodejs-modules": "off",
      "no-console": "off",
    },
  },
]);
