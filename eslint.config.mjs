import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["node_modules/**", "dist/**", "coverage/**"],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["src/**/*.ts"],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "error",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            "no-console": "warn",
            eqeqeq: ["error", "always"],
        },
    },

    prettier,
);
