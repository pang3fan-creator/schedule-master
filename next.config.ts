import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Enable production source maps for better debugging and Lighthouse analysis
  productionBrowserSourceMaps: true,

  // Performance optimizations
  experimental: {
    // Optimize imports for large packages to reduce bundle size
    optimizePackageImports: [
      "@clerk/nextjs",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-accordion",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "date-fns",
      "vaul",
      "react-day-picker",
      "cmdk",
    ],
    // Enable CSS optimization to reduce render-blocking CSS
    optimizeCss: true,
  },

  // Long-term caching for static assets
  async headers() {
    return [
      {
        // Apply to static assets (images, fonts, icons)
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/templates/ai-schedule-generator",
        destination: "/templates/ai-schedule-builder",
        permanent: true,
      },

      // --- Deleted Posts Redirects (English) ---
      {
        source: "/blog/employee-scheduling-guide",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/how-to-use-schedule-builder",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/acme-case-study",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/async-communication",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/remote-work-best-practices",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/scheduling-mistakes",
        destination: "/blog",
        permanent: true,
      },
      { source: "/blog/tagging-system", destination: "/blog", permanent: true },

      // --- Deleted Posts Redirects (Spanish) ---
      {
        source: "/es/blog/employee-scheduling-guide",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/how-to-use-schedule-builder",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/acme-case-study",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/async-communication",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/remote-work-best-practices",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/scheduling-mistakes",
        destination: "/es/blog",
        permanent: true,
      },
      {
        source: "/es/blog/tagging-system",
        destination: "/es/blog",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
