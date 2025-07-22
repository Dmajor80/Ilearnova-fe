import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy requests starting with `/api` to the real API server
      "/api": {
        target: "https://api.ilearnova.com",
        changeOrigin: true,
        secure: true, // Use false only if the API server has a self-signed SSL
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
