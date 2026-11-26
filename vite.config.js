import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  clearScreen: false,  // may remove if you prefer
  logLevel: "info",  // may remove if you prefer
  test: {
    environment: "jsdom",
    // ponytail: this one was written for Jest (never installed) and never ran; port when touched
    exclude: [
      "**/node_modules/**",
      "src/features/school-admin/__tests__/SchoolAdmin.test.jsx",
    ],
  },
});
