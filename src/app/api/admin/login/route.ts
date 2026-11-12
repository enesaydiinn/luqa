import { NextResponse } from "next/server";
import { z } from "zod";
import { authClient, requireAdmin } from "@/lib/supabase";
import { sameOrigin, failure, readJson } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Geçersiz kaynak.", 403);
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    return failure(
      "Yönetici girişi için Supabase bağlantısı yapılandırılmalıdır.",
      503,
    );
  let raw;
  try {
    raw = await readJson(request);
  } catch {
    return failure("Geçersiz veri.");
  }
  const v = z
    .object({ email: z.email().max(254), password: z.string().min(8).max(128) })
    .safeParse(raw);
  if (!v.success) return failure("E-posta ve şifrenizi kontrol edin.");
  const db = await authClient();
  const { error } = await db.auth.signInWithPassword(v.data);
  if (error)
    return failure("Giriş yapılamadı. Bilgilerinizi kontrol edin.", 401);
  if (!(await requireAdmin())) {
    await db.auth.signOut();
    return failure("Bu hesap yönetici erişimine sahip değil.", 403);
  }
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
