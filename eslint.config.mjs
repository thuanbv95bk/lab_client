import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  // Định cấu hình cho tất cả các file js, mjs, cjs và ts
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser, // Cấu hình globals cho môi trường browser
    },
    rules: {
      // Quy tắc camelCase cho các tên biến và hàm
      camelcase: ["error", { properties: "always" }],
      // Quy tắc PascalCase cho các lớp hoặc constructor functions
      "new-cap": ["error", { capIsNew: false }],
    },
  },

  // Định cấu hình riêng cho các file JavaScript
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
    plugins: { js },
    extends: ["plugin:js/recommended"], // Đưa quy tắc của plugin js vào
  },

  // Định cấu hình riêng cho TypeScript
  {
    files: ["**/*.{ts}"],
    plugins: ["@typescript-eslint"],
    extends: [
      "plugin:@typescript-eslint/recommended", // Dùng quy tắc TypeScript cơ bản
    ],
    rules: {
      // Thêm các quy tắc tùy chỉnh cho TypeScript nếu cần
      "@typescript-eslint/explicit-module-boundary-types": "off", // Ví dụ tắt quy tắc yêu cầu explicit types cho các boundary
    },
  },

  // Cấu hình chung cho TypeScript từ ts-eslint
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [
      "plugin:@typescript-eslint/recommended", // Kết hợp với TypeScript plugin
    ],
  },
]);
