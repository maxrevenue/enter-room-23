const path = require('path');

const rootDir = path.resolve(__dirname);

const nextConfig = {
  outputFileTracingRoot: rootDir,
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
  webpack(config, { dev }) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': rootDir,
    };
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
    return [
      { source: '/vault', destination: '/shop', permanent: true },
      { source: '/collections/vault', destination: '/shop', permanent: true },
      { source: '/collections/vintage', destination: '/shop', permanent: true },
      { source: '/archive', destination: '/journal', permanent: true },
      { source: '/column', destination: '/journal', permanent: true },
      { source: '/the-column', destination: '/journal', permanent: true },
      { source: '/products/lube-silicone-2oz', destination: '/products/platinum-silicone-lubricant-2oz', permanent: true },
      { source: '/products/lube-silicone-4oz', destination: '/products/platinum-silicone-lubricant-4oz', permanent: true },
      { source: '/shop/lube-silicone-2oz', destination: '/products/platinum-silicone-lubricant-2oz', permanent: true },
      { source: '/shop/lube-silicone-4oz', destination: '/products/platinum-silicone-lubricant-4oz', permanent: true },
      { source: '/shop/lube-silicone-8oz', destination: '/products/platinum-silicone-lubricant-8oz', permanent: true },
      { source: '/products/lube-silicone-8oz', destination: '/products/platinum-silicone-lubricant-8oz', permanent: true },
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
