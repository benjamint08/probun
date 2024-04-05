import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Probun",
  description: "Powerfull file-based routing for Bun servers",
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [{ text: "Home", link: "/" }],
    lastUpdated: {
      text: "Last Updated",
    },

    sidebar: [
      {
        items: [
          {
            text: "Introduction",
            link: "/docs/getting-started",
            items: [
              {
                text: "Handling Requests",
                link: "/docs/handling-requests",
              },
            ],
          },
          { text: "Middleware", link: "/docs/middleware" },
          { text: "Helpers", link: "/docs/helpers" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/benjamint08/probun" },
    ],
  },
});
