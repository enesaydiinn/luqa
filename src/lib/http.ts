import { NextResponse } from "next/server";
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([
    process.env.NEXT_PUBLIC_SITE_URL || "https://helloluqa.com",
  ]);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://127.0.0.1:3000");
    allowed.add("http://localhost:3000");
  }
  return !!origin && allowed.has(origin);
}
export function failure(message: string, status = 400) {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export async function readJson(request: Request, max = 16384) {
  if (
    !request.headers.get("content-type")?.includes("application/json") ||
    !request.body
  )
    throw new Error("content-type");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0,
    text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw new Error("payload");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}
