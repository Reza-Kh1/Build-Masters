1_ npm init
2_ npx tsc --init
3_ npm i dotenv cors helmet cookie-parser jsonwebtoken node-fetch nodemon express multer multer-s3 bcryptjs
5_ npm i prisma --save-dev
6_ npx prisma init
7_ npx prisma migrate dev --name init
8_ npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
9_ npm i --save-dev @types/cors @types/cookie-parser @types/jsonwebtoken @types/express @types/multer @types/multer-s3 @aws-sdk/client-s3

10_ create file nodemon.json:
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/server/server.ts"
}
open file package.json:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon --exec ts-node src/server/server.ts",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.{ts,tsx,js,json}"
  },

11_craete file eslint.config.cjs:
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


12_ create file .prettierrc : 
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

13_ open file tsconfig.json:
{
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"],
  "compilerOptions": {
    "target": "ES2020",
    "rootDir": "src",
    "typeRoots": ["./node_modules/@types", "./src/types"],
    "outDir": "./dist",
    "module": "CommonJS",                           
    "strict": true,      
    "esModuleInterop": true,                      
    "forceConsistentCasingInFileNames": true,           
    "skipLibCheck": true,    
}}    

14_ install redis
https://github.com/microsoftarchive/redis/releases
دانلود فایل Redis-x64-3.0.504.msi نصب
ویرایش متغیر محیطی PATH
ویندوز + R را بزنید و sysdm.cpl را وارد کنید → OK.

به تب Advanced بروید → Environment Variables....

در بخش System variables، متغیر Path را انتخاب و Edit کنید.

روی New کلیک کنید و مسیر Redis را Paste کنید (مثلاً C:\Program Files\Redis).

OK → OK → OK برای ذخیره تغییرات.
برای تست :
redis-cli ping

15_ برای استفاده از بک اپ 
ویندوز + R را بزنید و sysdm.cpl را وارد کنید → OK.

به تب Advanced بروید → Environment Variables....

در بخش System variables، متغیر Path را انتخاب و Edit کنید.
نسبت به ورژن دیتابیس خود عدد رو تغییر میدهید مثلا 15 یا 16 
C:\Program Files\PostgreSQL\17\bin
OK → OK → OK برای ذخیره تغییرات.
