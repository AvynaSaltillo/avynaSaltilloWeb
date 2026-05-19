// @ts-check

import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

  site: "https://avynasaltillo.beauty",

  output: "server",

  adapter: vercel(),

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  integrations: [

    react(),

    sitemap({

      filter: (page) => {

        // evita indexar páginas privadas/admin
        return ![
          "/admin",
          "/portal",
          "/grow"
        ].some((path) =>
          page.startsWith(path)
        );

      }

    })

  ]

});