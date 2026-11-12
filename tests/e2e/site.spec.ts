import { test, expect } from "@playwright/test";
test("katalog, filtre, ürün detayı ve SEO", async ({ page }) => {
  await page.goto("/koleksiyon");
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Ürün durumunu filtrele" })
    .selectOption("available");
  await expect(page.locator(".product-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Filtreleri Temizle" }).click();
  await page
    .getByRole("heading", { name: "LUQA Heritage", exact: true })
    .click();
  await expect(page).toHaveURL(/urun\/luqa-heritage/);
  await expect(page.locator("h1")).toHaveText("LUQA Heritage");
  await expect(page.locator(".gallery-note")).toContainText(
    "tasarım konseptini",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://helloluqa.com/urun/luqa-heritage",
  );
  await page.getByRole("button", { name: "Ürün görselini büyüt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Büyütülmüş görseli kapat" }).click();
});
test("ön talep doğrulaması ve kayıt yoksa dürüst hata", async ({ page }) => {
  await page.goto("/urun/luqa-heritage");
  await page.getByRole("button", { name: "Bu Ürünle İlgileniyorum" }).click();
  const d = page.getByRole("dialog");
  await expect(d.getByRole("combobox")).toHaveValue(
    "20000000-0000-4000-8000-000000000001",
  );
  await d.getByRole("button", { name: "Ön Talep Gönder" }).click();
  await expect(d.getByText("Adınızı ve soyadınızı yazın.")).toBeVisible();
  await d.getByRole("textbox", { name: "Ad Soyad" }).fill("Test Kullanıcı");
  await d.getByRole("textbox", { name: "E-posta" }).fill("test@example.com");
  await d.locator("input[name=privacy_acknowledged]").check();
  await expect(d.locator("input[name=marketing_consent]")).not.toBeChecked();
  await d.getByRole("button", { name: "Ön Talep Gönder" }).click();
  await expect(d.getByRole("alert")).toContainText(
    /Kaydınız oluşturulmadı|süresi geçersiz/,
  );
});
test("favoriler ve arama", async ({ page }) => {
  await page.goto("/koleksiyon");
  await page
    .getByRole("button", { name: "LUQA Heritage favorilere ekle", exact: true })
    .click();
  await page.getByRole("button", { name: "Favorilerim, 1 ürün" }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "LUQA Heritage" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pencereyi kapat" }).click();
  await page.getByRole("button", { name: "Ürün ara", exact: true }).click();
  await page.getByRole("textbox", { name: "Koleksiyonda ara" }).fill("Ivory");
  await expect(page.getByRole("dialog").locator(".search-result")).toHaveCount(
    1,
  );
});
test("mobil navigasyon ve yatay taşma", async ({ page }, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Menüyü aç" }).click();
    await page
      .getByRole("navigation", { name: "Mobil menü" })
      .getByRole("link", { name: "Koleksiyon" })
      .click();
    await expect(page).toHaveURL(/koleksiyon/);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("yönetim koruması", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("button", { name: "Güvenli Giriş" }),
  ).toBeVisible();
  expect((await request.get("/api/admin")).status()).toBe(401);
  await expect(page.locator(".admin-stats")).toHaveCount(0);
});
