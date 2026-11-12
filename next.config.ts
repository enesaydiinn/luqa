import type { NextConfig } from "next";
const preview = process.env.LUQA_STATIC_PREVIEW === "1";
const config: NextConfig = {
  ...(preview ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    qualities: [75, 90],
    unoptimized: preview,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  poweredByHeader: false,
  async headers() {
    return preview
      ? []
      : [
          {
            source: "/(.*)",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
              },
              { key: "X-Frame-Options", value: "DENY" },
              {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=()",
              },
              {
                key: "Content-Security-Policy",
                value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com; font-src 'self'; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
              },
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains",
              },
            ],
          },
        ];
  },
  // The hosting platform owns www/apex redirects. Duplicating a domain rule
  // here can send requests back to the host selected by the platform.
};
export default config;
