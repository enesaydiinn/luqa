import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
const mock = vi.hoisted(() => ({ rpc: vi.fn(), admin: vi.fn() }));
vi.mock("@/lib/supabase", () => ({
  serviceClient: () => ({ rpc: mock.rpc }),
  requireAdmin: mock.admin,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/config/content", () => ({
  content: {
    legalReady: true,
    contact: {
      name: "Test",
      address: "Test Address",
      email: "test@example.com",
    },
    privacyVersion: "test-1",
    domain: "https://helloluqa.com",
  },
}));
import { POST } from "@/app/api/preorders/route";
import { GET, POST as adminPOST } from "@/app/api/admin/route";
import { seedProducts } from "@/lib/seed";
const body = {
  full_name: "Test Kullanıcı",
  email: "test@example.com",
  product_id: null,
  marketing_consent: false,
  privacy_acknowledged: true,
  website: "",
  started_at: Date.now() - 5000,
};
function request(value = body, origin = "https://helloluqa.com") {
  return new Request("https://helloluqa.com/api/preorders", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": "192.0.2.1",
    },
    body: JSON.stringify(value),
  });
}
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://helloluqa.com");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
  vi.stubEnv("LEAD_RATE_LIMIT_SECRET", "test-only-strong-secret");
  vi.stubEnv("VERCEL", "1");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  mock.rpc.mockReset();
  mock.admin.mockResolvedValue(null);
});
afterEach(() => vi.unstubAllEnvs());
describe("Sunucuda ön talep güvenliği", () => {
  it("başarılı kaydı yalnızca veritabanı onayından sonra bildirir", async () => {
    mock.rpc.mockResolvedValue({ data: "test-id", error: null });
    const res = await POST(request());
    expect(res.status).toBe(201);
    expect(mock.rpc).toHaveBeenCalledWith(
      "submit_preorder",
      expect.objectContaining({
        p_email: "test@example.com",
        p_marketing_consent: false,
        p_fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    );
  });
  it("CSRF kaynağını reddeder", async () => {
    expect((await POST(request(body, "https://evil.example"))).status).toBe(
      403,
    );
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("sunucuda alanları doğrular", async () => {
    expect((await POST(request({ ...body, email: "wrong" }))).status).toBe(400);
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("yapılandırma eksikse kaydedildi iddiasında bulunmaz", async () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect((await POST(request())).status).toBe(503);
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("çok hızlı gönderimi durdurur", async () =>
    expect(
      (await POST(request({ ...body, started_at: Date.now() }))).status,
    ).toBe(400));
  it.each([
    ["RATE_LIMIT", 429],
    ["DUPLICATE", 409],
    ["PRODUCT_UNAVAILABLE", 400],
  ])("%s durumunu doğru işler", async (message, status) => {
    mock.rpc.mockResolvedValue({ data: null, error: { message } });
    expect((await POST(request())).status).toBe(status);
  });
  it("veritabanı hatasında başarı göstermez", async () => {
    mock.rpc.mockResolvedValue({
      data: null,
      error: { message: "offline", code: "DB_DOWN" },
    });
    expect((await POST(request())).status).toBe(503);
  });
});
describe("Yönetici erişim kontrolü", () => {
  it("anonim kullanıcıya özel kayıt döndürmez", async () =>
    expect((await GET()).status).toBe(401));
  it("anonim ürün ekleme isteğini reddeder", async () =>
    expect((await adminPOST(request())).status).toBe(401));
  it("yetkili yönetici ürün ekleyebilir", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    mock.admin.mockResolvedValue({ db: { from: () => ({ insert }) } });
    const res = await adminPOST(
      request({
        action: "save_product",
        product: seedProducts[0],
      } as unknown as typeof body),
    );
    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: "LUQA Heritage", is_published: true }),
    );
  });
  it("ürün güncellemesi doğru kimlikle sınırlanır", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null }),
      update = vi.fn(() => ({ eq }));
    mock.admin.mockResolvedValue({ db: { from: () => ({ update }) } });
    const res = await adminPOST(
      request({
        action: "save_product",
        id: seedProducts[0].id,
        product: { ...seedProducts[0], is_published: false },
      } as unknown as typeof body),
    );
    expect(res.status).toBe(200);
    expect(eq).toHaveBeenCalledWith("id", seedProducts[0].id);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ is_published: false }),
    );
  });
  it("talebi olan ürünün silinmesini güvenli şekilde raporlar", async () => {
    mock.admin.mockResolvedValue({
      db: {
        from: () => ({
          delete: () => ({
            eq: () => Promise.resolve({ error: { code: "23503" } }),
          }),
        }),
      },
    });
    const res = await adminPOST(
      request({
        action: "delete_product",
        id: seedProducts[0].id,
      } as unknown as typeof body),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toContain("yayından kaldırın");
  });
});
