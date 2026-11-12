import type { MetadataRoute } from "next";
import { content } from "@/config/content";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.LUQA_STATIC_PREVIEW === "1" ? undefined : "/",
      disallow:
        process.env.LUQA_STATIC_PREVIEW === "1" ? "/" : ["/admin", "/api/"],
    },
    sitemap: `${content.domain}/sitemap.xml`,
  };
}
