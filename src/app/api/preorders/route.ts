import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { leadSchema } from "@/lib/validation";
import { serviceClient } from "@/lib/supabase";
import { content } from "@/config/content";
import { sameOrigin, failure, readJson } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return failure("Bu kaynaktan istek kabul edilmiyor.", 403);
  let raw;
  try {
    raw = await readJson(request);
  } catch {
    return failure("Geçersiz form verisi.");
  }
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success)
    return failure("Lütfen formdaki bilgileri kontrol edin.");
  const v = parsed.data;
  if (Date.now() - v.started_at < 2000 || Date.now() - v.started_at > 86400000)
    return failure("Formun süresi geçersiz. Sayfayı yenileyip tekrar deneyin.");
  if (
    !content.legalReady ||
    !content.contact.name ||
    !content.contact.address ||
    !content.contact.email ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.LEAD_RATE_LIMIT_SECRET
  )
    return failure(
      "Ön talep kaydı henüz açılmadı. Kaydınız oluşturulmadı.",
      503,
    );
  if (
    Boolean(process.env.TURNSTILE_SECRET_KEY) !==
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  )
    return failure(
      "Form doğrulama hizmeti yapılandırılamadı. Kaydınız oluşturulmadı.",
      503,
    );
  if (process.env.TURNSTILE_SECRET_KEY) {
    try {
      const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: v.turnstile_token || "",
          }),
          signal: AbortSignal.timeout(8000),
        },
      );
      const verification = await res.json();
      if (!verification.success)
        return failure("Lütfen güvenlik doğrulamasını tamamlayın.");
    } catch {
      return failure(
        "Güvenlik doğrulaması yapılamadı. Lütfen tekrar deneyin.",
        503,
      );
    }
  }
  // Vercel replaces x-vercel-forwarded-for at its trusted proxy boundary.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim()
    : process.env.NODE_ENV === "development"
      ? "local-development"
      : null;
  if (!ip)
    return failure(
      "Sunucu hız sınırlama yapılandırması eksik. Kaydınız oluşturulmadı.",
      503,
    );
  const fingerprint = createHmac("sha256", process.env.LEAD_RATE_LIMIT_SECRET)
    .update(ip)
    .digest("hex");
  try {
    const db = serviceClient();
    const { data, error } = await db.rpc("submit_preorder", {
      p_product_id: v.product_id,
      p_full_name: v.full_name,
      p_email: v.email,
      p_phone: v.phone || null,
      p_message: v.message || null,
      p_marketing_consent: v.marketing_consent,
      p_privacy_version: content.privacyVersion,
      p_fingerprint: fingerprint,
    });
    if (error) {
      if (error.message.includes("RATE_LIMIT"))
        return failure(
          "Kısa sürede çok sayıda talep gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.",
          429,
        );
      if (error.message.includes("DUPLICATE"))
        return failure(
          "Bu ürün için talebinizi son 24 saat içinde zaten aldık.",
          409,
        );
      if (error.message.includes("PRODUCT_UNAVAILABLE"))
        return failure("Seçili ürün şu anda ön talebe kapalı.", 400);
      console.error("Lead insert failed", error.code);
      return failure("Talebiniz kaydedilemedi. Lütfen tekrar deneyin.", 503);
    }
    if (
      process.env.RESEND_API_KEY &&
      process.env.ADMIN_NOTIFICATION_EMAIL &&
      process.env.NOTIFICATION_FROM
    ) {
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.NOTIFICATION_FROM,
            to: process.env.ADMIN_NOTIFICATION_EMAIL,
            subject: "LUQA — yeni ön talep",
            text: `Yeni ön talep kaydedildi. Kayıt: ${data}. Ayrıntıları güvenli yönetim panelinde görüntüleyebilirsiniz: ${content.domain}/admin`,
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!r.ok) console.error("Notification delivery failed", r.status);
      } catch {
        console.error("Notification service unavailable");
      }
    }
    return NextResponse.json(
      {
        message:
          "Ön talebiniz kaydedildi. Gelişmeler kesinleştiğinde sizinle iletişim kuracağız.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return failure("Talep hizmetine ulaşılamadı. Kaydınız oluşturulmadı.", 503);
  }
}
