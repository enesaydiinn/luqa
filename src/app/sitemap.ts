import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { content } from "@/config/content";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    "",
    "/koleksiyon",
    "/hakkimizda",
    "/tasarim",
    "/iletisim",
    ...products.map((p) => `/urun/${p.slug}`),
  ].map((path) => ({
    url: content.domain + path,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
