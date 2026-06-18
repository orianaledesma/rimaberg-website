import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    // Serve modern formats first; next/image negotiates per browser.
    formats: ["image/avif", "image/webp"],
    // Allowed `quality` values (Next 15 requires whitelisting non-default ones).
    qualities: [70, 80, 90, 95],
    // Cache optimized variants for a year (filenames are stable).
    minimumCacheTTL: 31536000,
    // Admin-uploaded images live in Supabase Storage (public bucket).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default withNextIntl(nextConfig);
