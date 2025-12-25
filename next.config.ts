import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable production source maps for better debugging and Lighthouse analysis
  productionBrowserSourceMaps: true,

  // Performance optimizations
  experimental: {
    // Optimize imports for large packages to reduce bundle size
    optimizePackageImports: ['@clerk/nextjs', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    // Enable CSS optimization to reduce render-blocking CSS
    optimizeCss: true,
  },

  // Long-term caching for static assets
  async headers() {
    return [
      {
        // Apply to static assets (images, fonts, icons)
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
