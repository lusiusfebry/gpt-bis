import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const backendOrigin = env.VITE_BACKEND_ORIGIN || "http://localhost:3000";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,
        devOptions: {
          enabled: false,
        },
        manifest: false,
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/uploads\//],
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
          runtimeCaching: [
            {
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin && request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "app-pages",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24,
                },
              },
            },
            {
              urlPattern: ({ request, sameOrigin, url }) => {
                if (!sameOrigin) {
                  return false;
                }

                if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
                  return false;
                }

                return request.destination === "style" || request.destination === "script" || request.destination === "worker";
              },
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "app-static-assets",
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
            {
              urlPattern: ({ request, sameOrigin, url }) => {
                if (!sameOrigin || url.pathname.startsWith("/uploads/")) {
                  return false;
                }

                return request.destination === "image" || request.destination === "font";
              },
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "app-images-fonts",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: backendOrigin,
          changeOrigin: true,
        },
        "/uploads": {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
