import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json'
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                setTimeout: 'readonly',
                __dirname: 'readonly',
                module: 'readonly',
                require: 'readonly',
                // Browser globals for page.evaluate()
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                window: 'readonly',
                document: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            // TypeScript specific
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

            // General
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',

            // Best practices
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-throw-literal': 'error',

            // Turn off base rules that are handled by TypeScript
            'no-unused-vars': 'off'
        }
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'playwright-report/',
            'test-results/',
            'allure-results/',
            'allure-report/',
            'load-tests/',
            '*.config.js',
            '*.config.mjs'
        ]
    },
    prettier
];

