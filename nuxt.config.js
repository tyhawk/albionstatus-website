import { colors } from './tailwind/values'

const analyticsUA = 'UA-62902757-9'
const isDev = process.env.NODE_ENV !== 'production'
const isProd = !isDev

const baseUrl = 'https://www.albionstatus.com'

export default {
  modern: isProd && 'client',
  target: 'static',
  env: {
    baseUrl
  },
  head: {
    title: '',
    titleTemplate: s => s ? `${s} | AlbionStatus` : 'AlbionStatus - Is Albion Down?',
    noscript: [{ innerHTML: 'This website requires JavaScript.' }]
  },

  router: {
    trailingSlash: true
  },

  plugins: [
    '~/plugins/composition-api'
  ],

  generate: {
    fallback: true
  },

  meta: {
    name: 'AlbionStatus - Albion Online server status',
    author: 'Developmint',
    description: 'AlbionStatus is the only reliable Albion Online server status tracker. Find out if Albion is down' +
      ' in a splitsecond, no matter if the downtime is caused by the daily maintenance or an outage.',
    ogSiteName: 'AlbionStatus',
    mobileAppIOs: true,
    ogHost: 'https://albionstatus.com',
    twitterSite: '@AlbionStatus',
    twitterCard: 'summary'
  },

  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/google-analytics', {
      id: analyticsUA,
      disabled: () => document.cookie.includes('ga_optout=true'),
      debug: {
        sendHitTask: isProd
      },
      set: [
        { field: 'anonymizeIp', value: true }
      ]
    }],
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-4749840658812364',
      analyticsUacct: analyticsUA,
      test: isDev
    }],
    '@nuxtjs/pwa',
    'nuxt-svg-loader',
    '@nuxtjs/sitemap'
  ],
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/netlify-files'
  ],

  axios: {
    debug: isDev,
    baseURL: 'https://api.albionstatus.com'
  },

  loading: { color: colors.developmint['500'] },

  manifest: {
    lang: 'en',
    short_name: 'AlbionStatus',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    orientation: 'any',
    theme_color: colors.green['300']
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/app.pcss'
  },

  sitemap: {
    hostname: baseUrl,
    exclude: [
      '/legal',
      '/privacy'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmodrealtime: true
    },
    trailingSlash: true
  },

  netlifyFiles: {
    existingFilesDirectory: './netlify'
  },

  build: {
    publicPath: '/assets/',
    loaders: {
      vue: {
        compilerOptions: {
          whitespace: 'condense'
        }
      }
    },
    filenames: {
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name]-[hash:7].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name]-[hash:7].[ext]'
    },
    extend (config, ctx) {
      if (!ctx.isClient) {
        return
      }
      if (!ctx.isDev) {
        return
      }
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }
  }
}
