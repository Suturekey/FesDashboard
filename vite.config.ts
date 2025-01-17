/// <reference types="vite/types/importMeta.d.ts" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error Comment: no type declarations available for import url
import { fileURLToPath, URL } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
