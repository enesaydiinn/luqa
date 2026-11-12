import "server-only";
import { createClient } from "@supabase/supabase-js";
import { seedProducts } from "./seed";
import type { Product, SiteSettings } from "@/types";
export const isConnected = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
export async function getProducts(): Promise<Product[]> {
  if (!isConnected() || process.env.LUQA_STATIC_PREVIEW === "1")
    return seedProducts;
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data, error } = await db
    .from("products")
    .select("*,product_images(*)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error)
    throw new Error("Koleksiyon şu anda yüklenemiyor. Lütfen tekrar deneyin.");
  return (data || []).map((p) => ({
    ...p,
    product_images: p.product_images.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order,
    ),
  }));
}
export async function getSettings(): Promise<SiteSettings> {
  if (!isConnected() || process.env.LUQA_STATIC_PREVIEW === "1") return {};
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data, error } = await db.from("site_settings").select("key,value");
  if (error) return {};
  return Object.fromEntries((data || []).map((x) => [x.key, x.value]));
}
