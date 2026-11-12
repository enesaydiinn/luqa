import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/cormorant-garamond/latin-ext-400.css";
import "@fontsource/cormorant-garamond/latin-ext-400-italic.css";
import "@fontsource/cormorant-garamond/latin-ext-500.css";
import "@fontsource/manrope/latin-ext-400.css";
import "@fontsource/manrope/latin-ext-500.css";
import "@fontsource/manrope/latin-ext-600.css";
import "@/styles/globals.css";
import "@/styles/home.css";
import { SiteShell } from "@/components/site-shell";
import { getProducts } from "@/lib/catalog";
import { content } from "@/config/content";
export const metadata: Metadata = {
  metadataBase: new URL(content.domain),
  title: { default: "LUQA | Zarafet, Her Detayda", template: "%s | LUQA" },
  description: content.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "LUQA",
    title: "LUQA | Zarafet, Her Detayda",
    description: content.description,
    images: [
      {
        url: "/images/heritage.webp",
        width: 799,
        height: 533,
        alt: "LUQA HOME koleksiyon konsepti",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots:
    process.env.LUQA_STATIC_PREVIEW === "1"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts();
  } catch {}
  return (
    <html lang="tr">
      <body>
        <SiteShell products={products}>{children}</SiteShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "LUQA",
              url: content.domain,
              logo: `${content.domain}/images/wordmark.webp`,
            }).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
