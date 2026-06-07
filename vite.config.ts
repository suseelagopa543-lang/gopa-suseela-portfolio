import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Disable Nitro so `npm run build` outputs a plain static site to dist/
  // (dist/index.html + dist/assets/*) deployable to GitHub Pages, Vercel, Netlify.
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    // Enable SPA mode so TanStack Start generates a static index.html shell
    // at build time. The client router hydrates and handles routing.
    spa: {
      enabled: true,
    },
    pages: [
      {
        path: "/",
        prerender: { enabled: true, crawlLinks: true },
      },
    ],
  },
});
