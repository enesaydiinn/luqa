import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase";
import { sameOrigin, failure, readJson } from "@/lib/http";
import { productSchema } from "@/lib/validation";
export const dynamic = "force-dynamic";
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return failure("Oturum açmanız gerekiyor.", 401);
  const results = await Promise.all([
    admin.db
      .from("products")
      .select("*,product_images(*)")
      .order("created_at", { ascending: false }),
    admin.db
      .from("preorders")
      .select("*,products(name)")
      .order("created_at", { ascending: false })
      .limit(1000),
    admin.db.from("site_settings").select("*"),
    admin.db.from("collections").select("*"),
    admin.db.rpc("admin_dashboard"),
  ]);
  if (results.some((r) => r.error))
    return failure("Yönetim verileri yüklenemedi.", 503);
  return NextResponse.json(
    {
      products: results[0].data,
      leads: results[1].data,
      settings: results[2].data,
      collections: results[3].data,
      stats: results[4].data,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
const imageUrl = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      v.startsWith("/images/") ||
      (/^https:\/\//.test(v) &&
        (() => {
          try {
            return (
              new URL(v).hostname ===
              new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname
            );
          } catch {
            return false;
          }
        })()),
  );
const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("save_product"),
    id: z.uuid().optional(),
    product: productSchema,
  }),
  z.object({ action: z.literal("delete_product"), id: z.uuid() }),
  z.object({
    action: z.literal("update_lead"),
    id: z.uuid(),
    status: z.enum(["new", "reviewing", "contacted", "completed", "cancelled"]),
  }),
  z.object({
    action: z.literal("save_settings"),
    settings: z.record(
      z.enum([
        "hero_title",
        "hero_description",
        "hero_image",
        "collection_description",
        "story",
        "contact_email",
        "seo_title",
        "seo_description",
      ]),
      z.string().max(6000),
    ),
  }),
  z.object({ action: z.literal("delete_image"), id: z.uuid() }),
  z.object({
    action: z.literal("add_image"),
    product_id: z.uuid(),
    image_url: imageUrl,
    alt_text: z.string().min(3).max(240),
    sort_order: z.number().int().min(0).max(100),
  }),
]);
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Geçersiz kaynak.", 403);
  const admin = await requireAdmin();
  if (!admin) return failure("Yetkisiz erişim.", 401);
  let raw;
  try {
    raw = await readJson(request, 32768);
  } catch {
    return failure("Geçersiz veri.");
  }
  const parsed = actionSchema.safeParse(raw);
  if (!parsed.success) return failure("Lütfen alanları kontrol edin.");
  const v = parsed.data;
  let error;
  if (v.action === "save_product") {
    ({ error } = v.id
      ? await admin.db.from("products").update(v.product).eq("id", v.id)
      : await admin.db.from("products").insert(v.product));
  } else if (v.action === "delete_product") {
    ({ error } = await admin.db.from("products").delete().eq("id", v.id));
  } else if (v.action === "update_lead") {
    ({ error } = await admin.db
      .from("preorders")
      .update({ status: v.status })
      .eq("id", v.id));
  } else if (v.action === "delete_image") {
    ({ error } = await admin.db.from("product_images").delete().eq("id", v.id));
  } else if (v.action === "add_image") {
    ({ error } = await admin.db
      .from("product_images")
      .insert({
        product_id: v.product_id,
        image_url: v.image_url,
        alt_text: v.alt_text,
        sort_order: v.sort_order,
      }));
  } else if (v.action === "save_settings") {
    if (
      v.settings.hero_image &&
      !imageUrl.safeParse(v.settings.hero_image).success
    )
      return failure("Hero görseli yolu geçersiz.");
    if (
      v.settings.contact_email &&
      !z.email().safeParse(v.settings.contact_email).success
    )
      return failure("İletişim e-postasını kontrol edin.");
    ({ error } = await admin.db.from("site_settings").upsert(
      Object.entries(v.settings).map(([key, value]) => ({ key, value })),
      { onConflict: "key" },
    ));
  }
  if (error)
    return failure(
      error.code === "23503"
        ? "Bu ürünün talep kayıtları var. Silmek yerine yayından kaldırın."
        : "İşlem tamamlanamadı. Alanları ve bağlantıyı kontrol edin.",
      400,
    );
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
