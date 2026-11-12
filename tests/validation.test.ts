import { describe, it, expect } from "vitest";
import { leadSchema, productSchema } from "@/lib/validation";
import { seedProducts } from "@/lib/seed";
const valid = {
  full_name: "Test Kullanıcı",
  email: "USER@example.com",
  phone: "",
  product_id: seedProducts[0].id,
  message: "",
  marketing_consent: false,
  privacy_acknowledged: true,
  website: "",
  started_at: Date.now(),
};
describe("Ön talep doğrulaması", () => {
  it("pazarlama izni olmadan geçerli talebi kabul eder", () => {
    const r = leadSchema.parse(valid);
    expect(r.marketing_consent).toBe(false);
    expect(r.email).toBe("user@example.com");
  });
  it.each([
    { email: "hatalı" },
    { full_name: "A" },
    { privacy_acknowledged: false },
    { website: "spam.example" },
    { phone: "telefon" },
    { message: "a".repeat(2001) },
    { product_id: "invalid" },
  ])("geçersiz alanı reddeder: %j", (change) =>
    expect(leadSchema.safeParse({ ...valid, ...change }).success).toBe(false),
  );
  it("koleksiyonun tamamı için talep kabul eder", () =>
    expect(leadSchema.safeParse({ ...valid, product_id: null }).success).toBe(
      true,
    ));
});
describe("Konsept katalog ve CRUD doğrulaması", () => {
  it("konseptleri fiyat ve stok iddiası olmadan sunar", () => {
    expect(seedProducts).toHaveLength(4);
    expect(
      seedProducts.every((p) => p.status === "concept" && p.price === null),
    ).toBe(true);
  });
  it("her ürünün benzersiz SEO yolu ve galerisi vardır", () => {
    expect(new Set(seedProducts.map((p) => p.slug)).size).toBe(4);
    expect(
      seedProducts.every(
        (p) =>
          p.product_images.length >= 2 &&
          p.product_images.every((im) => im.alt_text.length > 10),
      ),
    ).toBe(true);
  });
  it("ürün düzenleme verisini kabul eder", () =>
    expect(productSchema.safeParse(seedProducts[0]).success).toBe(true));
  it("hatalı slug, negatif fiyat ve bilinmeyen durumu reddeder", () => {
    for (const edit of [
      { slug: "<script>" },
      { price: -1 },
      { status: "fake" },
    ])
      expect(
        productSchema.safeParse({ ...seedProducts[0], ...edit }).success,
      ).toBe(false);
  });
});
