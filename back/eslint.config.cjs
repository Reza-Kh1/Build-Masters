/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'prettier/prettier': 'error',
        },
    },
    ...eslintConfigPrettier,
];
