import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Lissto",
        short_name: "Lissto",
        description: "Offline-capable shopping checklist app",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#05769e",
        icons: [
          {
            src: "icon.svg",
            sizes: "48x48 72x72 96x96 128x128 256x256",
            type: "image/svg+xml",
          },
        ],
      },
      devOptions: {
        enabled: true, // 👈 important for dev
      },
      workbox: {
        navigateFallback: "/index.html", // ✅ fallback for SPA routes
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // ensure all assets are cached
      },
    }),
  ],
});
