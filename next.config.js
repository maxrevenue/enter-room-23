const path = require('path');

const rootDir = path.resolve(__dirname);

const nextConfig = {
  outputFileTracingRoot: rootDir,
  htmlLimitedBots: /.*/,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
  serverExternalPackages: ['mongodb'],
  turbopack: {
    resolveAlias: {
      '@': rootDir,
    },
  },
  webpack(config, { dev, isServer }) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': rootDir,
    };
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        'fs/promises': false,
      };
    }
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async redirects() {
    const retired = [
      { source: '/products', destination: '/shop', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/refund-policy', destination: '/shipping', permanent: true },
      { source: '/vault', destination: '/shop', permanent: true },
      { source: '/collections/vault', destination: '/shop', permanent: true },
      { source: '/collections/vintage', destination: '/shop', permanent: true },
      { source: '/archive', destination: '/journal', permanent: true },
      { source: '/column', destination: '/journal', permanent: true },
      { source: '/the-column', destination: '/journal', permanent: true },
      { source: '/products/ds-glass-wand', destination: '/shop', permanent: true },
      { source: '/shop/ds-glass-wand', destination: '/shop', permanent: true },
      { source: '/products/obsidian-glass-massage-wand', destination: '/shop', permanent: true },
      { source: '/products/ds-massage-oil', destination: '/shop', permanent: true },
      { source: '/shop/ds-massage-oil', destination: '/shop', permanent: true },
      { source: '/products/midnight-bloom-massage-oil', destination: '/shop', permanent: true },
      { source: '/products/ds-silk-blindfold', destination: '/shop', permanent: true },
      { source: '/shop/ds-silk-blindfold', destination: '/shop', permanent: true },
      { source: '/products/noir-silk-blindfold', destination: '/shop', permanent: true },
    ]

    const catalog = [
      { id: 'lube-silicone-2oz', slug: 'platinum-silicone-lubricant-2oz', aliases: [] },
      { id: 'lube-silicone-4oz', slug: 'platinum-silicone-lubricant-4oz', aliases: ['platinum-silicone-lubricant'] },
      { id: 'lube-silicone-8oz', slug: 'platinum-silicone-lubricant-8oz', aliases: [] },
      { id: 'skins-delay', slug: 'skins-delay-spray', aliases: ['skins-natural-delay-spray', 'skins-delay'] },
      { id: 'cg-oh-my', slug: 'cg-oh-my-warming-stimulant', aliases: ['cg-oh-my', 'oh-my-warming'] },
      { id: 'heli-lavender-mist', slug: 'heli-lavender-chamomile-mist', aliases: ['heli-lavender-mist', 'heli-mist'] },
      { id: 'arlo-atlas-oil', slug: 'arlo-atlas-body-oil', aliases: ['arlo-atlas-oil', 'atlas-body-oil'] },
      { id: 'pr-secret-garden-mist', slug: 'secret-garden-fragrance-mist', aliases: ['pr-secret-garden-mist', 'secret-garden-mist'] },
      { id: 'pr-dirty-french-gel', slug: 'dirty-french-shower-gel', aliases: ['pr-dirty-french-gel', 'dirty-french-gel'] },
      { id: 'cg-pole-polish', slug: 'cg-pole-polish', aliases: ['pole-polish', 'cg-pole-polish-strawberry'] },
      { id: 'cake-stroker', slug: 'cake-stroker', aliases: ['hello-cake-dual-texture-stroker', 'hello-cake-stroker'] },
    ]

    const seen = new Set(retired.map((rule) => rule.source))
    const productRedirects = []
    const add = (source, destination) => {
      if (!source || !destination || source === destination || seen.has(source)) return
      seen.add(source)
      productRedirects.push({ source, destination, permanent: true })
    }

    for (const product of catalog) {
      const dest = `/products/${product.slug}`
      if (product.id && product.id !== product.slug) {
        add(`/products/${product.id}`, dest)
        add(`/shop/${product.id}`, dest)
      }
      for (const alias of product.aliases || []) {
        if (alias && alias !== product.slug) {
          add(`/products/${alias}`, dest)
          add(`/shop/${alias}`, dest)
        }
      }
      add(`/shop/${product.slug}`, dest)
    }

    return [...retired, ...productRedirects]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || 'https://room23.net' },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Idempotency-Key" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
