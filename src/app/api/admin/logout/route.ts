import { NextResponse } from "next/server";
import { authClient } from "@/lib/supabase";
import { sameOrigin, failure } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Geçersiz kaynak.", 403);
  if (process.env.NEXT_PUBLIC_SUPABASE_URL)
    await (await authClient()).auth.signOut();
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
