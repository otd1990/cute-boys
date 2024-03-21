import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteEnvPlugin from "vite-plugin-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/cute-boys/",
});
