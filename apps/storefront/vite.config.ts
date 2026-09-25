import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_BFF_URL ?? "http://localhost:3090",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "/v1"),
      },
    },
  },
});
