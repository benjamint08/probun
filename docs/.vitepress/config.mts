import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Probun",
  description: "Powerfull file-based routing for Bun servers",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Introduction', link: '/docs/getting-started' },
          { text: 'Middleware', link: '/docs/middleware' },
          { text: 'Helpers', link: '/docs/helpers' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/benjamint08/probun' }
    ]
  }
})
