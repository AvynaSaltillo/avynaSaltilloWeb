// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  site: "https://avynasaltillo.beauty",

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap()
  ]
});