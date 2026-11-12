export const content = {
  brand: "LUQA",
  domain: "https://helloluqa.com",
  nav: [
    { href: "/koleksiyon", label: "Yeni Koleksiyon" },
    { href: "/koleksiyon#luqa-home", label: "LUQA HOME" },
    { href: "/tasarim", label: "Tasarım Detayları" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ],
  hero: {
    eyebrow: "LUQA HOME COLLECTION",
    title: "Zarafeti\nDetaylarda Keşfedin",
    description:
      "Özenle tasarlanan özel sandık ve saklama çözümleriyle anılarınızı şık, güvenli ve kalıcı bir şekilde saklayın.",
  },
  story:
    "LUQA, gündelik yaşamın vazgeçilmez parçalarını daha zarif, daha kullanışlı ve daha özenli hale getirme fikrinden doğdu. Gelenekten ilham alan, modern yaşamın ihtiyaçlarına cevap veren tasarımlar sunmayı hedefliyoruz.",
  description:
    "LUQA’nın özenle tasarlanan premium yaşam ürünlerini keşfedin. Zamansız zarafet, işlevsel tasarım ve kalite odaklı koleksiyonlar.",
  conceptNotice: "Görseller tasarım konseptini temsil etmektedir.",
  leadNotice:
    "Ön talep, satın alma veya kesin rezervasyon anlamına gelmez. Bu aşamada ödeme alınmaz.",
  statuses: {
    concept: "Konsept Tasarım",
    coming_soon: "Yakında",
    open: "Ön Talebe Açık",
    available: "Satışta",
    sold_out: "Tükendi",
  },
  leadStatuses: {
    new: "Yeni",
    reviewing: "İnceleniyor",
    contacted: "İletişime Geçildi",
    completed: "Tamamlandı",
    cancelled: "İptal",
  },
  privacyVersion: "2026-11-draft-1",
  legalReady: process.env.NEXT_PUBLIC_LEGAL_READY === "true",
  contact: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  },
};
