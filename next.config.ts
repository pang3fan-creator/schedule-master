import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize imports for large packages to reduce bundle size
    optimizePackageImports: ['@clerk/nextjs', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    // Enable CSS optimization to reduce render-blocking CSS
    optimizeCss: true,
  },
};

export default nextConfig;
