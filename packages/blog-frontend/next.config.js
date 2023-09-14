module.exports = withTM({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    // domains: ["storage.googleapis.com"],
  },
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});

/**
 * Bundle Analyzer
 * https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer
 *
 * Usage:
 * ANALYZE=true yarn[npm] build
 */

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
// module.exports = withBundleAnalyzer({});
